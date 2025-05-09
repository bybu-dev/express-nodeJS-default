import { DataSource } from 'typeorm';
import { logger } from './logger';
import { AdminModel } from '@/models/admin';
import { UserModel } from '@/models/user';

class DBConnection {
  private static dataSource: DataSource;

  static async connect(): Promise<DataSource> {
    try {
      let dbUrl = process.env.POSTGRES_URL ?? '';

      this.dataSource = new DataSource({
        type: 'postgres',
        url: dbUrl,
        entities: [ AdminModel, UserModel ],
        synchronize: true,
      });

      await this.dataSource.initialize();
      logger.info('Database connected successfully');
      return this.dataSource;
    } catch (err) {
      logger.error(`Database connection error: ${err}`);
      setTimeout(() => {
        logger.error('Retrying database connection...');
        this.connect();
      }, 5000);
      throw err;
    }
  }

  static async close(): Promise<void> {
    try {
      if (this.dataSource && this.dataSource.isInitialized) {
        await this.dataSource.destroy();
      }
    } catch (err) {
      logger.error(`Error during database disconnection: ${err}`);
      process.exit(1);
    }
  }
}

export default DBConnection;
