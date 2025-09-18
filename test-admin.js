// Simple test script to verify admin panel functionality
// Run this in browser console on admin pages

console.log('Testing Admin Panel...')

// Test 1: Check if localStorage is accessible
try {
  const auth = localStorage.getItem('adminAuth')
  console.log('✓ localStorage accessible, auth status:', auth)
} catch (error) {
  console.error('✗ localStorage error:', error)
}

// Test 2: Check if data functions work
try {
  // This would need to be imported in a real test
  console.log('✓ Data functions would be tested here')
} catch (error) {
  console.error('✗ Data functions error:', error)
}

// Test 3: Check for common admin panel issues
const issues = []

// Check for hydration mismatches
if (typeof window !== 'undefined' && window.location.pathname.includes('/admin')) {
  console.log('✓ Running on client side')
} else {
  issues.push('Running on server side - potential hydration issue')
}

// Check for missing authentication
if (typeof window !== 'undefined') {
  const auth = localStorage.getItem('adminAuth')
  if (!auth && window.location.pathname !== '/admin') {
    issues.push('Not authenticated but not on login page')
  }
}

if (issues.length === 0) {
  console.log('✓ No common issues detected')
} else {
  console.log('⚠️ Issues detected:', issues)
}

console.log('Admin Panel Test Complete')
