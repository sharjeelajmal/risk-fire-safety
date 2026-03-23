import mongoose from 'mongoose';
import Inspection from './src/models/Inspection';
import connectToDatabase from './src/lib/db';

async function testPartialIssue() {
  await connectToDatabase();
  const inspection = await Inspection.findOne();
  if (!inspection) {
    console.log('No inspection found to test with.');
    return;
  }

  const partialIssue = {
    issueNumber: "TEST-123",
    x: 10,
    y: 10,
    // location, responsibleContractor, description, measures are MISSING
  };

  try {
    inspection.issues.push(partialIssue);
    await inspection.save();
    console.log('Successfully saved partial issue!');
  } catch (err) {
    console.error('Failed to save partial issue:', err);
  } finally {
    // Cleanup if needed
    // inspection.issues.pull({ issueNumber: "TEST-123" });
    // await inspection.save();
    mongoose.connection.close();
  }
}

// testPartialIssue();
