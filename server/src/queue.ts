export interface AuditJob {
  id: string;
  tokenAddress: string;
  bytecode: string;
  consensusRequired: number;
  results: Array<{
    nodeId: string;
    score: number;
    approved: boolean;
  }>;
}

/**
 * Job Queue Broker routing token bytecode to active WebSockets Scout Nodes
 * and performing consensus weight scoring checks.
 */
export class OrchestratorJobQueue {
  private activeJobs: Map<string, AuditJob> = new Map();
  private connectedScoutNodes: Set<string> = new Set();

  public addNode(nodeId: string): void {
    this.connectedScoutNodes.add(nodeId);
    console.log(`[Queue] Scout Node registered: ${nodeId}. Active mesh size: ${this.connectedScoutNodes.size}`);
  }

  public removeNode(nodeId: string): void {
    this.connectedScoutNodes.delete(nodeId);
    console.log(`[Queue] Scout Node disconnected: ${nodeId}. Active mesh size: ${this.connectedScoutNodes.size}`);
  }

  public createJob(tokenAddress: string, bytecode: string): AuditJob {
    const job: AuditJob = {
      id: `job-${Math.random().toString(36).substring(2, 9)}`,
      tokenAddress,
      bytecode,
      consensusRequired: 3,
      results: []
    };
    this.activeJobs.set(job.id, job);
    console.log(`[Queue] Created audit job ${job.id} for contract ${tokenAddress}`);
    return job;
  }

  /**
   * Routes the job payload to three random Scout Nodes.
   */
  public routeJob(jobId: string): void {
    const job = this.activeJobs.get(jobId);
    if (!job) return;

    const availableNodes = Array.from(this.connectedScoutNodes);
    if (availableNodes.length < job.consensusRequired) {
      console.warn(`[Queue] Deferred job ${jobId}. Insufficient nodes online (${availableNodes.length}/${job.consensusRequired})`);
      return;
    }

    // Select three nodes
    const targets = availableNodes.sort(() => 0.5 - Math.random()).slice(0, job.consensusRequired);
    console.log(`[Queue] Routing job ${jobId} to consensus nodes: [${targets.join(', ')}]`);
  }

  /**
   * Submits result and flags validation consensus when all nodes report back.
   */
  public submitResult(jobId: string, nodeId: string, score: number, approved: boolean): void {
    const job = this.activeJobs.get(jobId);
    if (!job) return;

    job.results.push({ nodeId, score, approved });
    console.log(`[Queue] Received result for ${jobId} from ${nodeId}. Score: ${score}`);

    if (job.results.length >= job.consensusRequired) {
      this.evaluateConsensus(job);
    }
  }

  private evaluateConsensus(job: AuditJob): void {
    const approvesCount = job.results.filter(r => r.approved).length;
    const finalScore = job.results.reduce((acc, curr) => acc + curr.score, 0) / job.results.length;
    const approved = approvesCount >= Math.ceil(job.consensusRequired / 2);

    console.log(`[Queue] Job ${job.id} consensus reached: Score ${finalScore.toFixed(2)} | APPROVED = ${approved}`);
    this.activeJobs.delete(job.id);
  }
}
