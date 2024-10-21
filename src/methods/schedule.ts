import cron from 'node-cron';

import MemoryDB from '../services/MemoryDB';
const memoryDB = MemoryDB.getInstance();

export const scheduleDeleteOldData = () => {
  cron.schedule('0 0 * * *', async () => {
    memoryDB.cleanUpOldData();
  });
};
