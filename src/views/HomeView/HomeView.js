import React from 'react';
import PropTypes from 'prop-types';
import { Map } from '@material-ui/icons';
import SearchBar from '../../components/SearchBar';
import PaperButton from '../../components/PaperButton';
import { getIcon } from '../../components/SMIcon';
import MobileComponent from '../../components/MobileComponent';
import config from '../../../config';
import NewsInfo from '../../components/NewsInfo';

class HomeView extends React.Component {
  renderNavigationOptions = () => {
    const {
      classes, getAddressNavigatorParams, getLocaleText, toggleSettings, navigator, userLocation,
    } = this.props;
    const noUserLocation = !userLocation
      || !userLocation.coordinates
      || !userLocation.addressData;

    const notFoundText = noUserLocation ? 'location.notFound' : null;
    const subtitleID = userLocation && userLocation.allowed ? notFoundText
      : 'location.notAllowed';

    let areaSelection = null;

    if (config.showAreaSelection) {
      areaSelection = (
        <PaperButton
          messageID="home.buttons.area"
          icon={<Map />}
          link
          onClick={() => navigator.push('area')}
        />
      );
    }

    return (
      <div className={classes.background}>
        <div className={classes.buttonContainer}>
          {areaSelection}
          <PaperButton
            messageID="home.buttons.closeByServices"
            icon={getIcon('location')}
            link
            disabled={noUserLocation}
            onClick={() => {
              navigator.push('address', getAddressNavigatorParams(userLocation.addressData));
            }}
            subtitleID={subtitleID && subtitleID}
          />
          <PaperButton
            messageID="home.buttons.services"
            icon={getIcon('serviceList')}
            link
            onClick={() => navigator.push('serviceTree')}
          />
          <MobileComponent>
            <PaperButton
              messageID="home.buttons.settings"
              icon={getIcon('accessibility')}
              link
              onClick={() => toggleSettings('mobile')}
            />
          </MobileComponent>
          <PaperButton
            messageID="home.send.feedback"
            icon={getIcon('feedback')}
            link
            onClick={() => navigator.push('feedback')}
          />
          <PaperButton
            id="home-paper-info-button"
            messageID="info.title"
            icon={getIcon('help')}
            link
            onClick={() => {
              navigator.push('info', null, 'home-paper-info-button');
            }}
          />
          <PaperButton
            messageID="home.old.link"
            icon={<Map />}
            link
            onClick={() => {
              window.open(getLocaleText({
                fi: config.oldMapFi,
                sv: config.oldMapSv,
                en: config.oldMapEn,
              }));
            }}
          />
          <NewsInfo />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <SearchBar
          hideBackButton
          header
        />
        {
          this.renderNavigationOptions()
        }

        {/* <Container paper>
          <Typography
            className={classes.left}
            variant="subtitle1"
            component="h3"
          >
            {intl.formatMessage({ id: 'home.message' })}
          </Typography>
          <Typography className={classes.left} variant="body2">
            <b>31.10.2019</b>
            {' '}
- Käytettävyystutkimus on tehty ja tulokset analysoitu.
Olemme tällä hetkellä toteuttamassa käyttäjien huomioita ja meille on
esimerkiksi tulossa vaihtoehtoisesti valittavaksi mustavalkoinen käyttöliittymä.
Olemme parantamassa asetusten löydettävyyttä sekä hakutoiminnallisuutta.
Oli hienoa saada testaukseen monenlaisia käyttäjiä. Kiitos heille kaikille.
Turusta on tulossa uusi suurikontrastinen karttapohja parantamaan palvelun
käytettävyyttä heikkonäköisille.
            {' '}
            <br />
            <br />
            <b>25.9.2019</b>
            {' '}
- Palvelukartan käytettävyystutkimus on käynnissä ajalla 23.9- 4.10.2019.
Odotamme innolla tuloksia. Olemme tehneet syksyn ajan kovasti töitä ja nyt
sitten katsotaan mitä mieltä porukka on!
            {' '}
            <br />
            <br />
            <b>5.9.2019</b>
            {' '}
- Syyskuuta eletään. Palvelukartan pellin alla on tapahtunut paljon saavutettavuutta edistäviä asioita.
Nyt hiomme hakutoiminnallisuutta ja kunhan se on testikunnossa, käytettävyystestaajat lähtevät liikkeelle.
            {' '}
            <br />
            <br />
            <b>22.8.2019</b>
            {' '}
- Kesä alkaa lähestyä loppuaan ja työt taas jatkuvat täydellä vauhdilla. Heinäkuun aikana olemme kehittäneet uutta hakua
sekä korjanneet paljon pieniä ongelmia ja toiminnallisuutta koodin puolella. Nyt jatkamme uuden haun sekä hakukokemuksen
parantamisen parissa.
            {' '}
            <br />
            <br />
            <b>28.6.2019</b>
            {' '}
- Olemme saaneet kesäkuun aikana lisättyä toimipisteen sivuille lisää tietoa esteettömyydestä,
tapahtumista, tilavarauksista, ja lukukausitiedoista. Olemme myös lisänneet esteettömyysasetukset,
joiden avulla pystyy näkemään toimipistekohtaiset esteettömyysongelmat. Uusien ominaisuuksien lisäksi
kehitämme jatkuvasti saavutettavuutta ja käytettävyyttä.
            {' '}
            <br />
            <br />
            <b>14.5.2019</b>
            {' '}
- Olemme saaneet ensimmäisten viikkojen aikana ensimmäiset palautteet
            - kiitos niistä! Palautteen perusteella keskitymme seuraavaksi rakentamaan entistäkin
            paremman toimipisteen sivun, josta löydät kaikki toimipisteen tiedot esteettömyydestä
            tapahtumiin.
            {' '}
            <br />
            <br />
            <b>2.5.2019</b>
            {' '}
- Olemme tänään julkistaneet Palvelukartan avoimen kehitysversion!
            Ensimmäisessä versiossa keskitymme erityisesti hakukokemuksen parantamiseen.
            Lisäämme kehitysversioon uusia ominaisuuksia viikottain
            ja haluamme palautetta juuri sinulta.
            <br />
          </Typography>
        </Container> */}
      </div>
    );
  }
}


export default HomeView;

// Typechecking
HomeView.propTypes = {
  getAddressNavigatorParams: PropTypes.func.isRequired,
  getLocaleText: PropTypes.func.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  toggleSettings: PropTypes.func.isRequired,
  userLocation: PropTypes.objectOf(PropTypes.any),
};

HomeView.defaultProps = {
  navigator: null,
  userLocation: null,
};
