/**
 * Migration Script: Clean up old Division schema index
 * 
 * This script removes the old 'code_1' unique index from the divisions collection
 * which is causing E11000 duplicate key errors.
 * 
 * Run once: node migrations/cleanDivisionIndex.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/faculty_attendance';

async function cleanDivisionIndex() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const Division = mongoose.model('Division', new mongoose.Schema({}, { collection: 'divisions' }));
    const collection = Division.collection;

    // Get all indexes
    const indexes = await collection.listIndexes().toArray();
    console.log('\n📋 Current indexes on divisions collection:');
    indexes.forEach(index => {
      console.log(`   • ${index.name}:`, index.key);
    });

    // Check if problematic indexes exist
    const hasCodeIndex = indexes.some(idx => idx.name === 'code_1');
    const hasNameIndex = indexes.some(idx => idx.name === 'name_1');
    
    if (hasCodeIndex) {
      console.log('\n🔴 Found problematic "code_1" index. Dropping it...');
      await collection.dropIndex('code_1');
      console.log('✅ Successfully dropped "code_1" index');
    }
    
    if (hasNameIndex) {
      console.log('🔴 Found problematic "name_1" index. Dropping it...');
      await collection.dropIndex('name_1');
      console.log('✅ Successfully dropped "name_1" index');
    }
    
    if (!hasCodeIndex && !hasNameIndex) {
      console.log('\n✅ No problematic indexes found');
    }

    // Get updated indexes
    const updatedIndexes = await collection.listIndexes().toArray();
    console.log('\n📋 Updated indexes on divisions collection:');
    updatedIndexes.forEach(index => {
      console.log(`   • ${index.name}:`, index.key);
    });

    console.log('\n✅ Migration complete! You can now create divisions without errors.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

cleanDivisionIndex();
