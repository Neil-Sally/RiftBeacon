const fs = require('fs');
const path = require('path');

async function main() {
  console.log('Generating contract documentation...\n');

  const docsDir = path.join(__dirname, '../docs/contracts');
  
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const contracts = [
    'LivenessGateway',
    'AttestationRegistry',
    'NullifierSet',
    'ScoreEngine',
    'ZKVerifier',
    'PenaltyModule'
  ];

  contracts.forEach(name => {
    const content = `# ${name}

## Overview

Documentation for ${name} contract.

## Functions

Coming soon...

## Events

Coming soon...

## Errors

Coming soon...
`;
    
    fs.writeFileSync(path.join(docsDir, `${name}.md`), content);
    console.log(`Generated: ${name}.md`);
  });

  console.log('\nDocumentation generated successfully!');
}

main().catch(console.error);

