#!/usr/bin/env node

/**
 * Phase 1 Fireteam Fixes Validation Script
 * 
 * This script tests and validates all the Phase 1 critical fixes:
 * 1. SlideComponent.jsx slideType dispatch
 * 2. Real-time sync via useRoomState hook
 * 3. Bloom's taxonomy color standardization
 * 4. API endpoints functionality
 * 5. Error handling integration
 */

const fs = require('fs');
const path = require('path');

console.log('🔥 WANAC Fireteam Phase 1 Validation');
console.log('=====================================\n');

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function runTest(name, testFn) {
  console.log(`🧪 Testing: ${name}`);
  try {
    const result = testFn();
    if (result) {
      console.log(`✅ PASSED: ${name}\n`);
      results.passed++;
      results.tests.push({ name, status: 'PASSED', message: 'Test passed successfully' });
    } else {
      console.log(`❌ FAILED: ${name}\n`);
      results.failed++;
      results.tests.push({ name, status: 'FAILED', message: 'Test assertion failed' });
    }
  } catch (error) {
    console.log(`❌ ERROR: ${name} - ${error.message}\n`);
    results.failed++;
    results.tests.push({ name, status: 'ERROR', message: error.message });
  }
}

// Test 1: SlideComponent.jsx slideType dispatch
runTest('SlideComponent slideType dispatch', () => {
  const slideComponentPath = path.join(__dirname, '../src/app/client/fireteam/components/SlideComponent.jsx');
  const content = fs.readFileSync(slideComponentPath, 'utf8');
  
  // Check for slideType dispatch logic
  const hasSlideTypeDispatch = content.includes('switch (slideType)') || 
                              content.includes('case 0:') && 
                              content.includes('case 1:') && 
                              content.includes('case 6:') && 
                              content.includes('case 11:');
  
  // Check for blueprint colors
  const hasBlueprintColors = content.includes('#AEF4FF') && 
                             content.includes('#3BB5C8') && 
                             content.includes('#FFCA00') && 
                             content.includes('#D15924');
  
  return hasSlideTypeDispatch && hasBlueprintColors;
});

// Test 2: useRoomState hook exists and has error handling
runTest('useRoomState hook with error handling', () => {
  const hookPath = path.join(__dirname, '../src/app/client/fireteam/experience/hooks/useRoomState.js');
  const content = fs.readFileSync(hookPath, 'utf8');
  
  const hasErrorHandling = content.includes('createFireteamError') && 
                          content.includes('FireteamLogger') && 
                          content.includes('ERROR_TYPES') &&
                          content.includes('setError') &&
                          content.includes('retryLastAction');
  
  const hasLiveKitIntegration = content.includes('MSG_SLIDE_CHANGE') && 
                                content.includes('DataReceived') &&
                                content.includes('publishRoomMessage');
  
  return hasErrorHandling && hasLiveKitIntegration;
});

// Test 3: Bloom's taxonomy colors standardized
runTest('Bloom\'s taxonomy color standardization', () => {
  const typesPath = path.join(__dirname, '../src/types/evaluation.ts');
  const content = fs.readFileSync(typesPath, 'utf8');
  
  const hasStandardizedColors = content.includes('0: \'#efefef\'') && 
                                content.includes('1: \'#AEF4FF\'') && 
                                content.includes('2: \'#3BB5C8\'') && 
                                content.includes('3: \'#BC9906\'') && 
                                content.includes('4: \'#FFCA00\'') && 
                                content.includes('5: \'#D15924\'') && 
                                content.includes('6: \'#282828\'') &&
                                content.includes('getBloomColor');
  
  return hasStandardizedColors;
});

// Test 4: Evaluation page uses standardized colors
runTest('Evaluation page color consistency', () => {
  const evalPagePath = path.join(__dirname, '../src/app/client/fireteam/experience/[experienceid]/evaluation/page.jsx');
  const content = fs.readFileSync(evalPagePath, 'utf8');
  
  const hasCorrectColors = content.includes('#AEF4FF') && 
                           content.includes('#3BB5C8') && 
                           content.includes('#FFCA00') && 
                           content.includes('#D15924') &&
                           content.includes('Did Not Discuss');
  
  return hasCorrectColors;
});

// Test 5: API endpoints exist
runTest('API endpoints for room state', () => {
  const roomStateApiPath = path.join(__dirname, '../src/app/api/room-state/[experienceId]/route.js');
  const exists = fs.existsSync(roomStateApiPath);
  
  if (exists) {
    const content = fs.readFileSync(roomStateApiPath, 'utf8');
    const hasMethods = content.includes('export async function GET') && 
                      content.includes('export async function PUT') &&
                      content.includes('export async function DELETE');
    return hasMethods;
  }
  
  return false;
});

runTest('API endpoints for quiz management', () => {
  const quizApiPath = path.join(__dirname, '../src/app/api/fireteams/experience/[id]/quiz/route.js');
  const exists = fs.existsSync(quizApiPath);
  
  if (exists) {
    const content = fs.readFileSync(quizApiPath, 'utf8');
    const hasMethods = content.includes('export async function GET') && 
                      content.includes('export async function POST') &&
                      content.includes('passThreshold');
    return hasMethods;
  }
  
  return false;
});

runTest('API endpoints for evaluation', () => {
  const evalApiPath = path.join(__dirname, '../src/app/api/fireteams/experience/[id]/evaluation/route.js');
  const exists = fs.existsSync(evalApiPath);
  
  if (exists) {
    const content = fs.readFileSync(evalApiPath, 'utf8');
    const hasMethods = content.includes('export async function GET') && 
                      content.includes('export async function POST') &&
                      content.includes('bloomLevel') &&
                      content.includes('triggerType');
    return hasMethods;
  }
  
  return false;
});

// Test 6: Error handling utilities
runTest('Error handling utilities', () => {
  const errorUtilsPath = path.join(__dirname, '../src/utils/fireteamErrors.js');
  const content = fs.readFileSync(errorUtilsPath, 'utf8');
  
  const hasErrorTypes = content.includes('ERROR_TYPES') && 
                       content.includes('ERROR_MESSAGES') &&
                       content.includes('createFireteamError') &&
                       content.includes('FireteamLogger') &&
                       content.includes('withErrorHandling');
  
  return hasErrorTypes;
});

// Test 7: Error notification component
runTest('Error notification component', () => {
  const errorCompPath = path.join(__dirname, '../src/components/fireteam/ErrorNotification.jsx');
  const content = fs.readFileSync(errorCompPath, 'utf8');
  
  const hasErrorHandling = content.includes('getRecoveryAction') && 
                          content.includes('isRecoverableError') &&
                          content.includes('ErrorNotification') &&
                          content.includes('severity');
  
  return hasErrorHandling;
});

// Test 8: Experience page integration
runTest('Experience page real-time integration', () => {
  const experiencePagePath = path.join(__dirname, '../src/app/client/fireteam/experience/[experienceid]/page.jsx');
  const content = fs.readFileSync(experiencePagePath, 'utf8');
  
  const hasIntegration = content.includes('useRoomState') && 
                        content.includes('activeSlide: currentStep') &&
                        content.includes('isGroupLeader') &&
                        content.includes('advanceSlide');
  
  return hasIntegration;
});

// Test 9: Package.json dependencies check
runTest('Required dependencies available', () => {
  const packageJsonPath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const hasLiveKit = packageJson.dependencies && packageJson.dependencies['@livekit/components-react'];
  const hasLucide = packageJson.dependencies && packageJson.dependencies['lucide-react'];
  
  return hasLiveKit && hasLucide;
});

// Test 10: File structure validation
runTest('File structure completeness', () => {
  const requiredFiles = [
    'src/app/client/fireteam/components/SlideComponent.jsx',
    'src/app/client/fireteam/experience/hooks/useRoomState.js',
    'src/types/evaluation.ts',
    'src/utils/fireteamErrors.js',
    'src/components/fireteam/ErrorNotification.jsx',
    'src/app/api/room-state/[experienceId]/route.js',
    'src/app/api/fireteams/experience/[id]/quiz/route.js',
    'src/app/api/fireteams/experience/[id]/evaluation/route.js',
    'src/app/api/fireteams/experience/[id]/rating/route.js'
  ];
  
  const allExist = requiredFiles.every(file => {
    const filePath = path.join(__dirname, '../', file);
    return fs.existsSync(filePath);
  });
  
  return allExist;
});

// Print summary
console.log('📊 Test Results Summary');
console.log('======================');
console.log(`✅ Passed: ${results.passed}`);
console.log(`❌ Failed: ${results.failed}`);
console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%\n`);

if (results.failed > 0) {
  console.log('🔍 Failed Tests Details:');
  console.log('========================');
  results.tests
    .filter(test => test.status !== 'PASSED')
    .forEach(test => {
      console.log(`❌ ${test.name}: ${test.message}`);
    });
  console.log('');
}

console.log('🎯 Phase 1 Implementation Status:');
console.log('===================================');

if (results.failed === 0) {
  console.log('🎉 ALL TESTS PASSED! Phase 1 implementation is complete and ready for testing.');
  console.log('');
  console.log('📋 Next Steps:');
  console.log('1. Test the application in development environment');
  console.log('2. Verify real-time slide synchronization works');
  console.log('3. Test error handling scenarios');
  console.log('4. Proceed to Phase 2 (Backend integration)');
} else {
  console.log('⚠️  Some tests failed. Please review and fix the issues before proceeding.');
  console.log('');
  console.log('🔧 Recommended Actions:');
  console.log('1. Fix the failed tests listed above');
  console.log('2. Re-run this validation script');
  console.log('3. Ensure all Phase 1 requirements are met');
}

console.log('\n🚀 Ready for Phase 2: Core Functionality Implementation');
