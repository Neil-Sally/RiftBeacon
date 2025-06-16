const fs = require('fs');
const path = require('path');

async function main() {
  console.log('RiftBeacon Contract List\n');
  
  const contractsDir = path.join(__dirname, '../contracts');
  
  function listContracts(dir, prefix = '') {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !['node_modules', 'artifacts', 'cache'].includes(file)) {
        console.log(`${prefix}📁 ${file}/`);
        listContracts(filePath, prefix + '  ');
      } else if (file.endsWith('.sol')) {
        console.log(`${prefix}📄 ${file}`);
      }
    });
  }
  
  listContracts(contractsDir);
}

main().catch(console.error);

