class Rover {
   constructor(position) {
      this.position = position;
      this.mode = "NORMAL";
      this.generatorWatts = 110;
   }
   receiveMessage(messageObj){
      let results = [];
      let commandsArray = messageObj.commands; 
      for (let i = 0; i<commandsArray.length; i++){
         if(commandsArray[i]['commandType'] === 'MODE_CHANGE'){
            this.mode = commandsArray[i]['value'];
            results.push({completed: true});
         }
         if(commandsArray[i]['commandType'] === 'MOVE') {
            if (this.mode === "LOW_POWER") {
               results.push({completed: false});
            } 
            else if (this.mode === "NORMAL"){
            this.position = commandsArray[i]['value'];
            results.push({completed: true});
            }
         }
         if(commandsArray[i]['commandType'] === 'STATUS_CHECK') {
            results.push({
               completed: true, 
               roverStatus: {
                  mode: this.mode, 
                  generatorWatts: this.generatorWatts, 
                  position: this.position
               }
            });
         }
      }
      
      return {
         message: messageObj.name,
         results: results
      }
   }
}

module.exports = Rover;