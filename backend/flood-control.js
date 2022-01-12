const ipTable = {};


const permanentBans = []; // borde ligga i en fil eller i en databas

module.exports = function (req, res, next) {
 
  let ip = req.ip.split(":").pop();
  console.log(ip);


  if (permanentBans.includes(ip)) {
    return;
  }

  if (!ipTable[ip]) {
    ipTable[ip] = { attempts: [] };
  }
 
  ipTable[ip].attempts.push(new Date().getTime());
  console.log(ipTable);

 
  if (ipTable[ip].attempts.length > 0) {
    let sum = 0;
    for (let i = 1; i < ipTable[ip].attempts.length; i++) {
      let attempt = ipTable[ip].attempts[i];
      let prevAttempt = ipTable[ip].attempts[i - 1];
      sum += attempt - prevAttempt;
    }
    let freq = sum / ipTable[ip].attempts.length;
    console.log(freq);
 
    if (ipTable[ip].attempts.length > 50 && freq < 1000) {
  
      return; 
    }
    if (ipTable[ip].attempts.length > 500 && freq < 1500) {
      
      permanentBans.push(ip);
    }
    if (ipTable[ip].attempts.length > 5000 && freq < 1000 * 60 * 60) {
   
      permanentBans.push(ip);
    }
  }

  next(); 
};