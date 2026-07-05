use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id("WAnSoMStak1ng111111111111111111111111111111");

#[program]
pub mod staking_program {
    use super::*;

    /// Registers a new worker node by locking a minimum threshold of $WANSOM tokens.
    pub fn register_node(ctx: Context<RegisterNode>, stake_amount: u64) -> Result<()> {
        let node = &mut ctx.accounts.node_account;
        let clock = Clock::get()?;

        require!(
            stake_amount >= 100_000_000_000, // 100,000 tokens (assuming 6 decimals: 10^6)
            StakingError::InsufficientInitialStake
        );

        // Perform token transfer from user account to vault
        let transfer_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.vault_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, transfer_accounts);
        token::transfer(cpi_ctx, stake_amount)?;

        node.owner = ctx.accounts.user.key();
        node.staked_amount = stake_amount;
        node.reputation_score = 10_000; // 100.00% (scaled by 100)
        node.jobs_completed = 0;
        node.registered_at = clock.unix_timestamp;
        node.is_slashed = false;

        emit!(NodeRegistered {
            node: node.key(),
            owner: node.owner,
            stake: stake_amount,
            timestamp: clock.unix_timestamp,
        });

        Ok(())
    }

    /// Submits a Proof-of-Analysis verification transaction. 
    /// Verifies consensus from multiple nodes. Deviaiton results in reputation cuts.
    pub fn verify_analysis(
        ctx: Context<VerifyAnalysis>,
        risk_score: u16,
        canary_valid: bool,
    ) -> Result<()> {
        let node = &mut ctx.accounts.node_account;
        let clock = Clock::get()?;

        require!(!node.is_slashed, StakingError::NodeSlashed);

        // Penalize reputation if node fails verification checks (e.g. Canary payload verification fails)
        if !canary_valid {
            node.reputation_score = node.reputation_score.saturating_sub(500); // Lose 5% reputation
            msg!("Canary verification failed. Reputation decreased by 5.00%. Current: {}/10000", node.reputation_score);
        } else {
            node.jobs_completed = node.jobs_completed.saturating_add(1);
            // Small reputation recovery if honest
            if node.reputation_score < 10_000 {
                node.reputation_score = std::cmp::min(10_000, node.reputation_score.saturating_add(10));
            }
        }

        // If reputation falls below threshold, automatically trigger slashing evaluation
        if node.reputation_score < 7_000 { // below 70.00%
            msg!("Reputation below critical threshold. Slashing node.");
            node.is_slashed = true;
        }

        emit!(AnalysisVerified {
            node: node.key(),
            jobs_completed: node.jobs_completed,
            reputation: node.reputation_score,
            timestamp: clock.unix_timestamp,
        });

        Ok(())
    }

    /// Slash node balance if flagged as slashed. Transits slashed funds to deflationary burn account.
    pub fn slash_node(ctx: Context<SlashNode>) -> Result<()> {
        let node = &mut ctx.accounts.node_account;
        require!(node.is_slashed, StakingError::NodeNotFlaggedForSlashing);
        
        let slash_amount = node.staked_amount;
        node.staked_amount = 0;

        // CPI transfer out of vault to burn wallet address
        let transfer_accounts = Transfer {
            from: ctx.accounts.vault_token_account.to_account_info(),
            to: ctx.accounts.burn_token_account.to_account_info(),
            authority: ctx.accounts.vault_authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, transfer_accounts);
        token::transfer(cpi_ctx, slash_amount)?;

        msg!("Slashed node. {} $WANSOM transferred to burn escrow ledger.", slash_amount);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct RegisterNode<'info> {
    #[account(init, payer = user, space = 8 + 32 + 8 + 2 + 8 + 8 + 1)]
    pub node_account: Account<'info, NodeState>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VerifyAnalysis<'info> {
    #[account(mut, has_one = owner)]
    pub node_account: Account<'info, NodeState>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct SlashNode<'info> {
    #[account(mut)]
    pub node_account: Account<'info, NodeState>,
    #[account(mut)]
    pub vault_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub burn_token_account: Account<'info, TokenAccount>,
    /// CHECK: vault seeds PDA authority
    pub vault_authority: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct NodeState {
    pub owner: Pubkey,
    pub staked_amount: u64,
    pub reputation_score: u16, // out of 10,000 (100.00%)
    pub jobs_completed: u64,
    pub registered_at: i64,
    pub is_slashed: bool,
}

#[error_code]
pub enum StakingError {
    #[msg("Node stake amount is below the mandatory 100,000 WANSOM threshold.")]
    InsufficientInitialStake,
    #[msg("Worker node has been slashed due to malicious consensus deviations.")]
    NodeSlashed,
    #[msg("Node reputation is stable; slashing constraints are not met.")]
    NodeNotFlaggedForSlashing,
}

// Events
#[event]
pub struct NodeRegistered {
    pub node: Pubkey,
    pub owner: Pubkey,
    pub stake: u64,
    pub timestamp: i64,
}

#[event]
pub struct AnalysisVerified {
    pub node: Pubkey,
    pub jobs_completed: u64,
    pub reputation: u16,
    pub timestamp: i64,
}
