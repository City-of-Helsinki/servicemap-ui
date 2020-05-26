import { ReactSelector } from 'testcafe-react-selectors';


const addressBar = ReactSelector('AddressSearchBar InputBase');

function luminanace(r, g, b) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}
function contrast(rgb1, rgb2) {
  const lum1 = luminanace(rgb1[0], rgb1[1], rgb1[2]);
  const lum2 = luminanace(rgb2[0], rgb2[1], rgb2[2]);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05)
       / (darkest + 0.05);
}

export default () => {
  // test('Address search bar gets results', async (t) => {
  //   await t
  //     .typeText(addressBar, 'mann');
  //   // .expect(addressBar.value).eql('mann')
  // });

  test('Address search bar focus indicator contrast', async (t) => {
    await t
      .click(addressBar);
    // .expect(addressBar.value).eql('mann')

    console.log(contrast([71, 131, 235], [255, 255, 255]));
    // console.log(await addressBarProps);
    console.log(await (await addressBar.getStyleProperty('box-shadow')).split(/(?<=\))/)[0]);
    console.log(await addressBar.parent().getStyleProperty('background-color'));
  });
};
