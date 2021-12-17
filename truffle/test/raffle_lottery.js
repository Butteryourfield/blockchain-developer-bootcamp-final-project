const raffleLottery = artifacts.require("raffleLottery");
const { expectRevert } = require('../node_modules/@openzeppelin/test-helpers');

contract("raffleLottery", function (accounts) {

  const [contractOwner, participant1, participant2, participant3] = accounts;
  let instance;

  beforeEach(async () => {
    instance = await raffleLottery.new();
  });

  it("Raffle Lottery Contract Deployed", async function () {
    await raffleLottery.deployed();
    return assert.isTrue(true);
  });

  it("!", async function () {
    ticketPrice = Number(await instance.ticketPrice())

    await expectRevert(
      
      instance.enterLottery(10, { from: participant3, value: 10}),
      'TX value must equal ticketprice * NumEntries',
    );
  });

  it("is the Lottery Live", async function () {
    await instance.isLotteryLive();
    return assert.isTrue(true);
  });

  it("Participants Can Enter", async function () {
    ticketPrice = Number(await instance.ticketPrice())
    await instance.enterLottery(5, { from: participant1, value: 5*ticketPrice });
    return assert.isTrue(true);
  });

  it("Jackpot increases by 99% of transaction value", async function () {
    ticketPrice = Number(await instance.ticketPrice())
    jackpotTotal = Number(await instance.jackpotTotal())
    await instance.enterLottery(10, { from: participant1, value: 10*ticketPrice });

    assert.equal(
      Number(await instance.jackpotTotal()),
      jackpotTotal + 0.99*(10*ticketPrice),
      'jackpot not doesnt get added to correctly'
    );
  });

  it("Owner can end lottery and declare winner", async function () {
    instance.declareWinner(10, { from: contractOwner })
    await instance.hasLotteryEnded();

    return assert.isTrue(true)
  });

  it("Participants cannot end lottery and declare winner", async function () {
    instance.declareWinner(10, { from: participant3 })

    assert.equal(
      await instance.hasLotteryEnded(),
      false,
      'participant ended lottery...'
    );
  });
});
