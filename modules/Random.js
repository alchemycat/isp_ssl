class Random {
    random(length) {
        let result = '';
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
      
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
      
        return result;
      }
      
}

exports.Random = Random;