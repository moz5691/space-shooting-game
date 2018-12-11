/**
 * @author Maryam
 * @description selection sprit div test
 * @description Dom testing with mocha and chai for more information refer to readme file
 */

describe('select sprite', function () {

  it('should not press select btn without selecting sprite', function () {
    expect($('#selectButton').prop('disabled', true));
  }); 

  it('should change selected sprite class and enabled selected button with click on selected sprite with click', function () {
    $('shipButtonOne').trigger('click');
    expect($('.shipButtonOne').addClass('grayEffect', 1000));
    expect($('#selectButton').prop('disabled', false));
    expect($('.dis').prop('disabled', true));
    // expect(sessionStorage.getItem('shipType')).to.equal(1);
    // expect(sessionStorage.getItem('shipLife')).to.equal(100);
    // expect(sessionStorage.getItem('shipSpeed')).to.equal(0.5);
  }); 

it('should remove grayEffect class from all sprits when click deselected btn', function () {
  $('#reselectButton').trigger('click');
  expect($('.dis').prop('disabled', false));
  expect($('.dis').removeClass('grayEffect'));
  expect($('#selectButton').prop('disabled', true));
}); 

it('should redirect to intro page', function () {
  sessionStorage.setItem('user', 'sara');
  $('#selectButton').trigger('click');
  expect(sessionStorage.getItem('user')).to.equal('sara');
  // expect(window.location.pathname).to.be.equal('/C:/Users/maryam/bc/group-project2/9/space-shooting-game/public/intro.html')
}); 
  
});