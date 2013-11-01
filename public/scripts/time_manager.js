define([], function () {
  var TimeManager = {
    decomposeTime: function (integerTime) {
      var pm = false,
          hour, minute,
          decoratedTime;
  
      if (integerTime > 1159) {
        integerTime = integerTime - 1200;
        pm = true;
      }
  
      hour = Math.floor(integerTime / 100);
      if ((hour == 0)) {
        hour = 12;
      }
      minute = integerTime % 100;
  
      return {
        hour: hour,
        minute: minute,
        pm: pm
      }
    },
  
    decorateTime: function (integerTime) {
      time = TimeManager.decomposeTime(integerTime);
      minutes = time.minute
      if (minutes == 0) {
        minutes.toString();
        minutes = minutes + "0";
      } 
  
      decoratedTime = time.hour + ':' + minutes + (time.pm ? 'pm' : 'am')
      return decoratedTime;
    },
    addMinutesToTime: function (integerTime, minutes) {
      time = TimeManager.decomposeTime(integerTime);
      hours = Math.floor(minutes / 60);
      minutes = minutes % 60;
  
      sumOfMinutes = time.minute + minutes;
      sumOfHours = time.hour + hours;
      if (sumOfMinutes > 60) {
        hours += 1
        minutes = sumOfMinutes % 60;
      } else {
        minutes = sumOfMinutes;
      }
  
      if (time.pm) {
        sumOfHours += 12;
      }
  
      outputIntegerTime = (sumOfHours * 100) + minutes;
      return outputIntegerTime;
    }
  }  

  return TimeManager;
})