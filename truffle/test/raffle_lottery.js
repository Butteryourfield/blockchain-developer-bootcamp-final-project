const raffleLottery = artifacts.require("raffleLottery");
const { expectRevert } = require('../node_modules/@openzeppelin/test-helpers');

contract("raffleLottery", function (accounts) {

  const [contractOwner, participant1, participant2, participant3] = accounts;
  let instance;

  // new instance of contract before every test
  beforeEach(async () => {
    instance = await raffleLottery.new();
  });
  
  // is deployed?
  it("Raffle Lottery Contract Deployed", async function () {
    await raffleLottery.deployed();
    return assert.isTrue(true);
  });

  // Deployed correctly and live?
  it("is the Lottery Live", async function () {
    await instance.isLotteryLive();
    return assert.isTrue(true);
  });

  // Check if participant can buy tickets
  it("Participants Can Enter", async function () {
    ticketPrice = Number(await instance.ticketPrice())
    await instance.enterLottery(5, { from: participant1, value: 5*ticketPrice });
    return assert.isTrue(true);
  });

  // check if jackpot increased the right amount after buying tickets
  it("Jackpot increases by 99% of transaction value", async function () {
    ticketPrice = Number(await instance.ticketPrice())
    jackpotTotal = Number(await instance.jackpotTotal())
    await instance.enterLottery(10, { from: participant2, value: 10*ticketPrice });

    assert.equal(
      Number(await instance.jackpotTotal()),
      jackpotTotal + 0.99*(10*ticketPrice),
      'jackpot not doesnt get added to correctly'
    );
  });

  // only process TX if msg value is equal to ticketPrice * numEntries
  it("TX value must equal ticketprice * NumEntries", async function () {
    ticketPrice = Number(await instance.ticketPrice())

    await expectRevert(
      
      instance.enterLottery(10, { from: participant3, value: 10}),
      'TX value must equal ticketprice * NumEntries',
    );
  });

  // make sure openzepploin ownable function working for certain functions
  it("Participants cannot end lottery and declare winner", async function () {
    await expectRevert(
      instance.declareWinner(10, { from: participant3 }),
      'Ownable: caller is not the owner -- Reason given: Ownable: caller is not the owner.',
    );
  });

  it("Owner can end lottery and declare winner", async function () {
    await instance.declareWinner(10, { from: contractOwner })
    await instance.hasLotteryEnded();

    return assert.isTrue(true)
  });

  it("Participants cannot self destruct contract", async function () {
    await expectRevert(
      instance.selfDestruct({ from: participant3 }),
      'Ownable: caller is not the owner -- Reason given: Ownable: caller is not the owner.',
    );
  });

  // can only self destruct if lottery has ended and winner declared
  it("Cannot self destruct if lottery active", async function () {

    await expectRevert(
      instance.selfDestruct({ from: contractOwner }),
      'lottery still active',
    );
  });

  // testing self destruct of contract
  it("Owner can self Destruct", async function () {
    await instance.declareWinner(10, { from: contractOwner })
    await instance.selfDestruct({ from: contractOwner })

    return assert.isTrue(true)
  });

  // it("TX value must equal ticketprice * NumEntries", async function () {
  //   ticketPrice = Number(await instance.ticketPrice())

  //   await expectRevert(
      
  //     instance.enterLottery(10, { from: participant3, value: 10}),
  //     'TX value must equal ticketprice * NumEntries',
  //   );
  // });

  // it("Only Owner can selfdestruct", async function () {
  //   ticketPrice = Number(await instance.ticketPrice())

  //   await expectRevert(
      
  //     instance.selfDestruct({ from: participant3 }),
  //     'cannot self destruct',
  //   );

  //   await instance.selfDestruct({ from: contractOwner })

  //   return assert.isTrue(true)
  // });
});
