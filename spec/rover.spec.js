const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {
  // 7 tests here!
  it("constructor sets position and default values for mode and generatorWatts", ()=> {
    let rover = new Rover(87382098);
    let expected = {position: 87382098, mode: "NORMAL", generatorWatts: 110};
    expect(rover).toEqual(expected);
  });
  it("response returned by receiveMessage contains the name of the message", ()=> {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let rover = new Rover(87382098);
    let result = rover.receiveMessage(message);
    expect(result.message).toBe('Test message with two commands');
  });
  it("response returned by receiveMessage includes two results if two commands are sent in the message", ()=>{
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let rover = new Rover(87382098);
    let result = rover.receiveMessage(message);
    expect(result.results.length === 2).toBe(true);
  });
  it("responds correctly to the status check command", ()=>{
    let commands = [new Command('STATUS_CHECK')];
    let message = new Message('Test message with STATUS_CHECK command', commands);
    let rover = new Rover(87382098);
    let actual = rover.receiveMessage(message).results[0];
    let expected = {
      roverStatus: {mode: 'NORMAL', generatorWatts: 110, position: 87382098}
      }
    expect(actual).toMatchObject(expected);
  });
  it("responds correctly to the mode change command", ()=>{
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let rover = new Rover(87382098);
    let actual = rover.receiveMessage(message);
    let expected = {
      message: 'Test message with two commands',
      results: [
        {completed: true},
        {
          completed: true, 
          roverStatus: { mode: 'LOW_POWER', generatorWatts: 110, position: 87382098 }
        }
      ]
    }
    expect(actual).toMatchObject(expected);
  });
  it("responds with a false completed value when attempting to move in LOW_POWER mode", ()=>{
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('MOVE', 900900)];
    let message = new Message('Test message with two commands', commands);
    let rover = new Rover(87382098);
    let completed = rover.receiveMessage(message).results[1]["completed"];
    expect(completed).toBe(false);
  });
  it("responds with the position for the move command",()=>{
    let commands = [new Command('MOVE', 900900), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let rover = new Rover(87382098);
    actual = rover.receiveMessage(message).results[1]['roverStatus']['position'];
    expect(actual).toBe(900900);
  });
});
