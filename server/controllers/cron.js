const { CronJob } = require('cron');
const rantModel = require('../models/Rant.Model.js');
const confessionModel=require('../models/Confess.Model.js')
function cronJob() {
  new CronJob(
    '0 2 * * *',
    async () => {
      const cutoff = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000);
      try {
        const respRant = await rantModel.deleteMany({ createdAt: { $lt: cutoff } });
        const respConfession = await confessionModel.deleteMany({ createdAt: { $lt: cutoff } });
        console.log(`Deleted ${respRant.deletedCount} old Rants`);
        console.log(`Deleted ${respConfession.deletedCount} old Confessions`);
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    },
    null,
    true,
  );
  console.log('Rant/Confession cleanup job scheduled for 2 AM daily');
}

module.exports = cronJob;