import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { BaseRepository } from '../repositories/_base';

export class PollingService<TTable extends PgTableWithColumns<any>> {
  private interval: number;
  private isPolling: boolean;
  private queue: TTable['$inferSelect'][];
  private onFetch: () => Promise<TTable['$inferSelect'][]>;
  private onProcessed: (id: string) => Promise<void>;

  constructor(
    onFetch: () => Promise<TTable['$inferSelect'][]>,
    onProcessed: (id: string) => Promise<void>,
    intervalInHours: number = 1
  ) {
    this.interval = intervalInHours * 60 * 60 * 1000; // Convert hours to milliseconds
    this.isPolling = false;
    this.queue = [];
    this.onFetch = onFetch;
    this.onProcessed = onProcessed;
  }

  public async pollDatabase(): Promise<void> {
    if (this.isPolling) {
      console.log(
        `[PollingService] Polling is already in progress. Skipping this cycle.`
      );
      return;
    }

    this.isPolling = true; // Set polling flag
    console.log(
      `[PollingService] Polling started at ${new Date().toISOString()}`
    );

    try {
      const results = await this.onFetch();

      if (results.length > 0) {
        console.log(
          `[PollingService] Found ${results.length} new record(s). Adding to queue.`
        );
        await this.addToQueue(results);
      } else {
        console.log(`[PollingService] No new records found.`);
      }
    } catch (error) {
      console.error(`[PollingService] Error while polling:`, error);
    } finally {
      this.isPolling = false; // Reset polling flag
      console.log(`[PollingService] Polling completed. Scheduling next run.`);
      setTimeout(() => this.pollDatabase(), this.interval); // Schedule the next run
    }
  }

  private async addToQueue(rows: TTable['$inferSelect'][]): Promise<void> {
    for (const row of rows) {
      if (!this.queue.find((item) => item.id === row.id)) {
        this.queue.push(row); // Add to queue only if it's not already present
        console.log(`[PollingService] Added row ID ${row.id} to the queue.`);
      }
    }
    this.processQueue(); // Process the queue after adding new items
  }

  private async processQueue(): Promise<void> {
    while (this.queue.length > 0) {
      const item = this.queue.shift(); // Get the first item from the queue
      if (item) {
        console.log(`[PollingService] Processing row ID: ${item.id}`);
        await this.performAction(item);
        await this.markAsProcessed(item.id); // Mark the row as processed in the database
      }
    }
  }

  private async performAction(row: TTable['$inferSelect']): Promise<void> {
    // Perform your custom action with the row
    console.log(`[PollingService] Performing action for row ID: ${row.id}`);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async processing
  }

  private async markAsProcessed(id: string): Promise<void> {
    try {
      this.onProcessed(id);
      console.log(`[PollingService] Marked row ID ${id} as processed.`);
    } catch (error) {
      console.error(
        `[PollingService] Failed to mark row ID ${id} as processed:`,
        error
      );
    }
  }
}
