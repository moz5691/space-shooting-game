/**
 * @author Maryam
 * @description selection sprit div test
 * @description Dom testing with mocha and chai for more information refer to readme file
 */

describe('select sprite', function () {

  it('should not press select btn without selecting sprite', function () {
    expect($('#selectButton').prop('disabled', true));
  }); 

  it('should #1 change selected sprite class and enabled selected button with click on selected sprite with click', function () {
    $('.shipButtonOne').trigger('click');
    expect($('.shipButtonOne').addClass('grayEffect', 1000));
    expect($('#selectButton').prop('disabled', false));
    expect($('.dis').prop('disabled', true));
  }); 

  it('should #2 change selected sprite class and enabled selected button with click on selected sprite with click', function () {
    $('.shipButtonTwo').trigger('click');
    expect($('.shipButtonTwo').addClass('grayEffect', 1000));
    expect($('#selectButton').prop('disabled', false));
    expect($('.dis').prop('disabled', true));
  }); 

  it('should #3 change selected sprite class and enabled selected button with click on selected sprite with click', function () {
    $('.shipButtonThree').trigger('click');
    expect($('.shipButtonThree').addClass('grayEffect', 1000));
    expect($('#selectButton').prop('disabled', false));
    expect($('.dis').prop('disabled', true));
  }); 


  it('should #4 change selected sprite class and enabled selected button with click on selected sprite with click', function () {
    $('.shipButtonFour').trigger('click');
    expect($('.shipButtonFour').addClass('grayEffect', 1000));
    expect($('#selectButton').prop('disabled', false));
    expect($('.dis').prop('disabled', true));
  }); 

  it('should #5 change selected sprite class and enabled selected button with click on selected sprite with click', function () {
    $('.shipButtonFive').trigger('click');
    expect($('.shipButtonFive').addClass('grayEffect', 1000));
    expect($('#selectButton').prop('disabled', false));
    expect($('.dis').prop('disabled', true));
  }); 

  it('should #6 change selected sprite class and enabled selected button with click on selected sprite with click', function () {
    $('.shipButtonSix').trigger('click');
    expect($('.shipButtonSix').addClass('grayEffect', 1000));
    expect($('#selectButton').prop('disabled', false));
    expect($('.dis').prop('disabled', true));
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
}); 
  
});