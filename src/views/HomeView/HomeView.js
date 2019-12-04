import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import SearchBar from '../../components/SearchBar';
import { MobileComponent } from '../../layouts/WrapperComponents/WrapperComponents';
import PaperButton from '../../components/PaperButton';
import fetchAddress from '../MapView/utils/fetchAddress';
import { getIcon } from '../../components/SMIcon';

class HomeView extends React.Component {
  componentDidMount() {
    const { setCurrentPage } = this.props;
    setCurrentPage('home');
  }

  onExapmleItemClick = (e, searchText) => {
    e.preventDefault();
    const {
      fetchUnits, navigator,
    } = this.props;
    if (navigator) {
      navigator.push('search', { query: searchText });
    }

    if (searchText && searchText !== '') {
      fetchUnits(searchText);
    }
  }

  renderNavigationOptions = () => {
    const {
      classes, getLocaleText, toggleSettings, navigator, userLocation,
    } = this.props;
    const disableCloseByServices = !userLocation
      || !userLocation.latitude
      || !userLocation.longitude;

    return (
      <div className={classes.buttonContainer}>
        <PaperButton
          disabled={disableCloseByServices}
          text={<FormattedMessage id="home.buttons.closeByServices" />}
          icon={getIcon('location', { className: classes.icon })}
          link
          onClick={() => {
            if (disableCloseByServices) {
              return;
            }
            const latLng = { lat: userLocation.latitude, lng: userLocation.longitude };
            fetchAddress(latLng)
              .then((data) => {
                navigator.push('address', {
                  municipality: data.street.municipality,
                  street: getLocaleText(data.street.name),
                  number: data.number,
                });
              });
          }}
        />
        <PaperButton
          text={<FormattedMessage id="home.buttons.services" />}
          icon={getIcon('serviceList', { className: classes.icon })}
          link
          onClick={() => navigator.push('serviceTree')}
        />
        <MobileComponent>
          <PaperButton
            text={<FormattedMessage id="home.buttons.settings" />}
            icon={getIcon('accessibility', { className: classes.icon })}
            link
            onClick={() => toggleSettings('all')}
          />
        </MobileComponent>
        <PaperButton
          text={<FormattedMessage id="home.send.feedback" />}
          icon={getIcon('feedback', { className: classes.icon })}
          link
          onClick={() => window.open('https://forms.gle/roe9XNrZGQWBhMBJ7')}
        />
      </div>
    );
  }

  render() {
    const { intl } = this.props;

    return (
      <>
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
      </>
    );
  }
}


export default injectIntl(HomeView);

// Typechecking
HomeView.propTypes = {
  fetchUnits: PropTypes.func,
  setCurrentPage: PropTypes.func.isRequired,
  getLocaleText: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  toggleSettings: PropTypes.func.isRequired,
  userLocation: PropTypes.objectOf(PropTypes.any),
};

HomeView.defaultProps = {
  fetchUnits: () => {},
  navigator: null,
  userLocation: null,
};
