const axios = require('axios');

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoYXNfZ3Vlc3QiOmZhbHNlLCJ0eXBlIjoiQUNDRVNTIiwiaXNzIjoiYmx1bSIsInN1YiI6IjA0YWVhMjliLTljNzQtNDEwNi1hMDdiLTBjYTFkNTE4ZTBkZiIsImV4cCI6MTcxNTQzMzUyMSwiaWF0IjoxNzE1NDI5OTIxfQ.a4kCSUUjKnG89Nqqssh8F8M2BVlVAgrE9HWLsOYVMys';

async function getClaim() {
  try {
    const response = await axios.post(
      'https://game-domain.blum.codes/api/v1/farming/claim',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    startFarm();
    console.log(response.data.availableBalance);
  } catch (error) {
    console.log(error.response.data.message);
    console.log('belum waktunya klaim...');
    startFarm();
  }
}

async function startFarm() {
  try {
    const response = await axios.post(
      'https://game-domain.blum.codes/api/v1/farming/start',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    getBalance();
  } catch (error) {
    console.log(error.response.data);
  }
}

async function getBalance() {
  try {
    const response = await axios.get(
      'https://game-domain.blum.codes/api/v1/user/balance',
      {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
          Authorization: `Bearer ${token}`,
          Origin: 'https://telegram.blum.codes',
          Priority: 'u=1, i',
          Referer: 'https://telegram.blum.codes/',
          'Sec-Ch-Ua':
            '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        },
      }
    );
    console.log('balance : ', response.data.availableBalance);
    const endTimeUnix = response.data.farming.endTime;
    const endTimeDate = new Date(endTimeUnix);
    const now = new Date();

    const timeDifference = endTimeDate.getTime() - now.getTime();
    let timeDifferenceInMinutes = Math.ceil(timeDifference / (1000 * 60));
    const timerInterval = setInterval(() => {
      if (timeDifferenceInMinutes <= 0) {
        clearInterval(timerInterval);
        console.log('Waktu klaim telah tiba!');
        return;
      }

      console.log(`Sisa waktu klaim: ${timeDifferenceInMinutes} menit`);
      timeDifferenceInMinutes--;
    }, 60 * 1000);

    setTimeout(getClaim, timeDifference);
    console.log('Klaim selanjutnya :', timeDifferenceInMinutes, 'menit lagi');
  } catch (error) {
    console.log(error);
  }
}

getClaim();
// getBalance();
// startFarm();
