#!/usr/bin/env node

/**
 * CSS Analysis Script
 * 
 * Analyzes the compiled CSS bundle to identify:
 * - Total size and line count
 * - Bootstrap vs custom CSS breakdown
 * - Most common selectors and patterns
 * - Potential optimization opportunities
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSS_FILE = path.join(__dirname, '../static/css/devportal2024-v1.css');

function analyzeCSS() {
  console.log('🔍 Analyzing CSS Bundle...\n');

  if (!fs.existsSync(CSS_FILE)) {
    console.error(`❌ CSS file not found: ${CSS_FILE}`);
    console.log('💡 Run "npm run build-css" first to generate the CSS bundle.');
    process.exit(1);
  }

  const css = fs.readFileSync(CSS_FILE, 'utf-8');
  const stats = fs.statSync(CSS_FILE);

  // Basic stats
  const lines = css.split('\n').length;
  const sizeKB = (stats.size / 1024).toFixed(2);
  const selectors = css.match(/[^{}]+(?=\{)/g) || [];
  const uniqueSelectors = new Set(selectors.map(s => s.trim())).size;

  console.log('📊 Bundle Statistics:');
  console.log('━'.repeat(50));
  console.log(`   Size:              ${sizeKB} KB`);
  console.log(`   Lines:             ${lines.toLocaleString()}`);
  console.log(`   Total Selectors:   ${selectors.length.toLocaleString()}`);
  console.log(`   Unique Selectors:  ${uniqueSelectors.toLocaleString()}`);
  console.log('');

  // Bootstrap component detection
  const bootstrapPatterns = {
    'Grid System': /\.(container|row|col-)/g,
    'Buttons': /\.btn-/g,
    'Forms': /\.(form-control|form-select|form-check)/g,
    'Cards': /\.card-/g,
    'Navbar': /\.navbar-/g,
    'Dropdown': /\.dropdown-/g,
    'Modal': /\.modal-/g,
    'Alert': /\.alert-/g,
    'Badge': /\.badge-/g,
    'Breadcrumb': /\.breadcrumb/g,
    'Pagination': /\.page-/g,
    'Accordion': /\.accordion/g,
    'Carousel': /\.carousel/g,
    'Tooltip': /\.tooltip/g,
    'Popover': /\.popover/g,
    'Toast': /\.toast/g,
    'Spinner': /\.spinner-/g,
  };

  console.log('🎨 Bootstrap Component Usage:');
  console.log('━'.repeat(50));
  
  const componentUsage = [];
  for (const [component, pattern] of Object.entries(bootstrapPatterns)) {
    const matches = css.match(pattern);
    const count = matches ? matches.length : 0;
    componentUsage.push({ component, count });
  }

  componentUsage.sort((a, b) => b.count - a.count);
  componentUsage.forEach(({ component, count }) => {
    const bar = '█'.repeat(Math.min(Math.floor(count / 10), 40));
    console.log(`   ${component.padEnd(20)} ${count.toString().padStart(4)} ${bar}`);
  });
  console.log('');

  // Custom classes analysis
  const customPatterns = [
    { name: 'Dev Tools', pattern: /\.(rpc-tool|websocket|code-tab)/g },
    { name: 'Navigation', pattern: /\.(top-nav|side-nav|breadcrumb)/g },
    { name: 'Content', pattern: /\.(content-|landing-|page-)/g },
    { name: 'Cards', pattern: /\.(card-deck|project-card)/g },
    { name: 'Video', pattern: /\.video-/g },
    { name: 'Blog', pattern: /\.blog-/g },
  ];

  console.log('🎯 Custom Component Patterns:');
  console.log('━'.repeat(50));
  customPatterns.forEach(({ name, pattern }) => {
    const matches = css.match(pattern);
    const count = matches ? matches.length : 0;
    if (count > 0) {
      console.log(`   ${name.padEnd(20)} ${count.toString().padStart(4)}`);
    }
  });
  console.log('');

  // Optimization recommendations
  console.log('💡 Optimization Recommendations:');
  console.log('━'.repeat(50));
  
  const recommendations = [];
  
  // Check for unused Bootstrap components
  const lowUsageComponents = componentUsage.filter(c => c.count < 5 && c.count > 0);
  if (lowUsageComponents.length > 0) {
    recommendations.push({
      priority: 'HIGH',
      message: `${lowUsageComponents.length} Bootstrap components with <5 usages detected`,
      action: 'Consider manually importing only needed Bootstrap modules'
    });
  }

  const noUsageComponents = componentUsage.filter(c => c.count === 0);
  if (noUsageComponents.length > 0) {
    recommendations.push({
      priority: 'HIGH',
      message: `${noUsageComponents.length} Bootstrap components with 0 usages detected`,
      action: 'Remove unused components from Bootstrap import'
    });
  }

  if (sizeKB > 200) {
    recommendations.push({
      priority: 'CRITICAL',
      message: 'Bundle size exceeds 200KB',
      action: 'Implement PurgeCSS to remove unused styles'
    });
  }

  recommendations.push({
    priority: 'MEDIUM',
    message: 'No code splitting detected',
    action: 'Consider splitting vendor CSS from custom styles'
  });

  recommendations.forEach(({ priority, message, action }) => {
    const emoji = priority === 'CRITICAL' ? '🔴' : priority === 'HIGH' ? '🟡' : '🔵';
    console.log(`   ${emoji} [${priority}] ${message}`);
    console.log(`      → ${action}`);
    console.log('');
  });

  // Estimate potential savings
  const estimatedReduction = Math.round(parseFloat(sizeKB) * 0.75);
  const estimatedFinal = Math.round(parseFloat(sizeKB) * 0.25);
  
  console.log('📈 Estimated Optimization Potential:');
  console.log('━'.repeat(50));
  console.log(`   Current Size:      ${sizeKB} KB`);
  console.log(`   Potential Savings: ~${estimatedReduction} KB (75%)`);
  console.log(`   Expected Size:     ~${estimatedFinal} KB`);
  console.log('');
}

analyzeCSS();

