/* eslint-disable max-len */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Typography, ButtonBase, Link, NoSsr,
} from '@mui/material';
import config from '../../../config';
import { TitleBar } from '../../components';
import useMobileStatus from '../../utils/isMobile';

const InfoView = ({ classes, locale }) => {
  const isMobile = useMobileStatus();

  const a11yURLs = config.accessibilityStatementURL;
  const localeUrl = !a11yURLs[locale] || a11yURLs[locale] === 'undefined' ? null : a11yURLs[locale];

  const handleClick = () => {
    window.open(localeUrl);
  };

  const renderTitlebar = () => (
    <TitleBar
      sticky
      ariaHidden
      backButton={!isMobile}
      title={<FormattedMessage id="info.title" />}
      titleComponent="h3"
    />
  );
  const renderFinnishInfo = () => (
    <div className={classes.textContainer}>
      {localeUrl ? (
        <>
          <Typography component="h3" variant="body2">Palvelukartan saavutettavuus</Typography>
          <ButtonBase className={classes.linkButton} role="link" onClick={() => handleClick()}>
            <Typography color="inherit" variant="body2"><FormattedMessage id="info.statement" /></Typography>
          </ButtonBase>
        </>
      ) : null}
      <Typography component="h3" variant="body2"><FormattedMessage id="app.title" /></Typography>
      <Typography className={classes.text} variant="body2">
        Palvelukartalta löytyy Espoon, Helsingin, Kauniaisten, Vantaan, Länsi-Uudenmaan sekä Vantaan
        ja Keravan hyvinvointialueiden julkiset toimipisteet ja niiden palvelut. Esimerkiksi koulut,
        päiväkodit sekä terveysasemat.
      </Typography>

      <Typography className={classes.text} variant="body2">
        Palvelukartalta löytyy lisäksi muitakin palveluja, kuten HUSin röntgenit, Kirkkonummen
        liikuntapalvelut, HSY:n kierrätyspisteet, Aalto-yliopiston ja muita valtion palveluja.
        Lisäksi kartalta löytyy yksityisiä palveluita, jotka tulevat Kaupunki alustana palvelun
        kautta.
      </Typography>
      {
        // Haku
      }
      <Typography component="h3" variant="body2">Haku</Typography>
      {/* <Typography className={classes.text} variant="body2"> */}
      <Typography component="h4" variant="body2">Palvelukartalta voit hakea esimerkiksi:</Typography>
      <ul>
        <li><Typography variant="body2">terveysasemia</Typography></li>
        <li><Typography variant="body2">kouluja</Typography></li>
        <li><Typography variant="body2">päiväkoteja</Typography></li>
        <li><Typography variant="body2">uimahalleja</Typography></li>
        <li><Typography variant="body2">pallokenttiä</Typography></li>
        <li><Typography variant="body2">kirjastoja</Typography></li>
        <li><Typography variant="body2">nuorisotaloja</Typography></li>
        <li><Typography variant="body2">iltapäivätoiminnan toimipisteitä</Typography></li>
        <li><Typography variant="body2">kierrätyspisteitä</Typography></li>
        <li><Typography variant="body2">röntgen pisteitä</Typography></li>
        <li><Typography variant="body2">pysäköintilippuautomaatteja</Typography></li>
        <li><Typography variant="body2">veistoksia</Typography></li>
        <li><Typography variant="body2">tapahtumia</Typography></li>
        <li><Typography variant="body2">osoitteita</Typography></li>
        <li><Typography variant="body2">väestönsuojia</Typography></li>
      </ul>
      <Typography component="h4" variant="body2">Vaihtoehtoisia hakutapoja:</Typography>
      <ul>
        <li>
          <Typography variant="body2">
            Aloita kirjoittamaan hakukenttään hakemaasi sanaa, jolloin saat hakuehdotuksia, joista
            voit valita itsellesi sopivimman. Esimerkiksi ”päiväko”
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            Voit myös kirjoittaa hakemasi sanan kokonaisuudessaan ja painaa tämän jälkeen Hae
            –painiketta tai Enter näppäimistöltä. Esimerkiksi ”luontopolku”.
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            Jos hakutulos ei ollut hyvä, voit tarkentaa hakua Tarkenna–painikkeella.
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            Voit hakea myös usean sanan yhdistelmällä, esimerkiksi ”koulu espanja”.
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            Hae osoitteella: kirjoita osoite, minkä läheltä etsit palvelua. Hae osoitteella:
            kirjoita osoite, minkä läheltä etsit palvelua.
          </Typography>
        </li>
      </ul>
      <Typography className={classes.text} variant="body2">
        Hakukentässä on ruksi, jota painamalla voit tyhjentää haun. Palvelukartan hakukentän
        nuolipainikkeella voit palata edelliseen näkymään. Jos hakutulos on tyhjä, tarkista
        kirjoitusasu ja aluevalinnat.
      </Typography>
      <Typography component="h4" variant="body2">Voit järjestää hakutulokset:</Typography>
      <ul>
        <li><Typography variant="body2">aakkosjärjestys, A-Ö</Typography></li>
        <li><Typography variant="body2">käänteinen aakkosjärjestys Ö-A</Typography></li>
        <li><Typography variant="body2">esteettömin ensin</Typography></li>
        <li><Typography variant="body2">lähin ensin (anna palvelukartalle lupa paikantaa sinut)</Typography></li>
      </ul>
      <Typography className={classes.text} variant="body2">
        Jos olet valinnut jonkin esteettömyysasetuksen (esim. käytän kuulolaitetta), hakutulos
        järjestyy esteettömin palvelu ensin (palvelussa on induktiosilmukka). Jos vaihdat
        esteettömyysasetusta, järjestys voi muuttua.
      </Typography>
      <Typography className={classes.text} variant="body2">
        Jos annat luvan Palvelukartan paikantaa sinut, hakutulos järjestyy sinua lähin palvelu
        ensin. Osoitteen voi myös kirjoittaa käsin.
      </Typography>
      <Typography component="h3" variant="body2">Osoitehaku</Typography>
      <Typography className={classes.text} variant="body2">
        Voit kirjoittaa hakukenttään kadun nimen, josta haluat etsiä palveluja. Haku antaa sinulle
        valittavaksi kadun nimen, valittuasi tulee osoite-ehdotukset. Helsingin kohdalla tulee myös
        alue-ehdotuksia (esim. oppilaaksiotto-alueet).
      </Typography>
      <Typography component="h4" variant="body2">Kohdasta ”Alueesi palvelut” löydät mm. seuraavat palvelut:</Typography>
      <ul>
        <li><Typography variant="body2">terveyskeskus</Typography></li>
        <li><Typography variant="body2">neuvola</Typography></li>
        <li><Typography variant="body2">suomen- ja ruotsinkielinen esiopetus</Typography></li>
        <li><Typography variant="body2">suomen- ja ruotsinkielinen ala-aste</Typography></li>
        <li><Typography variant="body2">suomen- ja ruotsinkielinen ylä-aste</Typography></li>
        <li><Typography variant="body2">pysäköintialueet</Typography></li>
        <li><Typography variant="body2">postinumeroalue</Typography></li>
        <li><Typography variant="body2">kaupunginosa</Typography></li>
        <li><Typography variant="body2">suojelupiiri</Typography></li>
        <li><Typography variant="body2">suojelulohko</Typography></li>
        <li><Typography variant="body2">suojelu alalohko</Typography></li>
        <li><Typography variant="body2">luonnonsuojelu-alueet</Typography></li>
      </ul>
      <Typography component="h3" variant="body2">Palveluluettelo</Typography>
      <Typography className={classes.text} variant="body2">
        Palveluluettelo löytyy Palvelukartan ylä-osioista. Voit etsiä palvelupuun avulla yhtä tai
        useampaa palvelukokonaisuutta. Esim. lähiliikunta, liikuntapuistot ja päiväkoti. Muista
        painaa lopuksi ”Tee haku” painiketta.
      </Typography>
      <Typography component="h3" variant="body2">Omat asetukset</Typography>
      <Typography className={classes.text} variant="body2">
        Sivun ylälaidasta sekä hakuruudun alapuolelta löydät omat asetukset. Täältä voit valita
        seuraavista itsellesi sopivat asetukset:
      </Typography>
      <ul>
        <li><Typography variant="body2">Aistirajoitteet:</Typography></li>
        <ul>
          <li><Typography variant="body2">käytän kuulolaitetta</Typography></li>
          <li><Typography variant="body2">olen näkövammainen</Typography></li>
          <li><Typography variant="body2">minun on vaikea erottaa värejä</Typography></li>
        </ul>
        <li><Typography variant="body2">Liikkumisrajoitteet:</Typography></li>
        <ul>
          <li><Typography variant="body2">käytän pyörätuolia</Typography></li>
          <li><Typography variant="body2">olen liikkumisesteinen</Typography></li>
          <li><Typography variant="body2">käytän rollaattoria</Typography></li>
          <li><Typography variant="body2">työnnän rattaita</Typography></li>
        </ul>
        <li><Typography variant="body2">Kaupunkiasetuksesi:</Typography></li>
        <ul>
          <li><Typography variant="body2">Helsinki</Typography></li>
          <li><Typography variant="body2">Espoo</Typography></li>
          <li><Typography variant="body2">Vantaa</Typography></li>
          <li><Typography variant="body2">Kauniainen</Typography></li>
          <li><Typography variant="body2">Kirkkonummi</Typography></li>
        </ul>
      </ul>

      <Typography className={classes.text} variant="body2">
        Jos valitset jonkin esteettömyysasetuksen, hakemasi toimipistesivu näyttää sinulle
        esimerkiksi, miten pääset rollaattorilla toimipisteeseen ja mitkä ovat mahdolliset esteet
        siellä.
      </Typography>
      <Typography className={classes.text} variant="body2">
        Kun valitset jonkin kaupungin, hakutulokset kohdistuvat ainoastaan tämän kaupungin
        tietoihin. Jos et ole valinnut yhtäkään kaupunkia, haku kohdistuu kaikkiin kaupunkeihin.
      </Typography>

      <Typography component="h4" variant="body2">Karttatyökalut</Typography>
      <Typography className={classes.text} variant="body2">
        Karttatyökaluista löydät mahdollisuuksia hyödyntää Palvelukarttaa seuraavien työkalujen
        avulla:
      </Typography>
      <ul>
        <li><Typography variant="body2">Palvelukartan upotustyökalu</Typography></li>
        <li><Typography variant="body2">Lataa tiedot</Typography></li>
        <li><Typography variant="body2">Tulosta</Typography></li>
        <li><Typography variant="body2">Mittaa etäisyys hiirellä</Typography></li>
      </ul>

      <Typography component="h4" variant="body2">Karttapohjan asetukset</Typography>
      <Typography className={classes.text} variant="body2">
        Löydät halutun karttapohjan karttatyökaluista. Voit valita karttapohjaksi seuraavat:
      </Typography>
      <ul>
        <li><Typography variant="body2">palvelukartta/oletuskartta</Typography></li>
        <li><Typography variant="body2">ilmakuva</Typography></li>
        <li><Typography variant="body2">opaskartta</Typography></li>
        <li><Typography variant="body2">korkeakontrastinen kartta</Typography></li>
      </ul>

      <Typography component="h3" variant="body2">Palaute</Typography>
      <Typography className={classes.text} variant="body2">
        Kiitämme kaikesta palautteesta, jotta voimme kehittää Palvelukarttaa yhä paremmaksi. Voit
        lähettää Palvelukartasta yleistä palautetta kartan kehittäjille:&nbsp;
        <Link target="_blank" href="https://palvelukartta.hel.fi/fi/feedback">
          <Typography variant="string">https://palvelukartta.hel.fi/fi/feedback</Typography>
        </Link>
        &nbsp;
        (linkki, avautuu uudella välilehdellä).
      </Typography>
      <Typography className={classes.text} variant="body2">
        Voit lähettää toimipisteeseen liittyvää palautetta suoraan palvelukartan toimipistesivulta.
        Hae haluamasi toimipiste, niin löydät palautelomakkeen toimipisteen tiedoista perustiedot
        –välilehdeltä.
      </Typography>

      <Typography component="h3" variant="body2">Tiedot ja tekijänoikeudet</Typography>
      <Typography className={classes.text} variant="body2">
        Palvelukartta on rakennettu mahdollisimman täydellisesti avointa dataa ja avointa
        lähdekoodia käyttäen. Kartan lähdekoodi löytyy GitHubista ja sen kehittämiseen rohkaistaan.
      </Typography>
      <ul>
        <li>
          <Link target="_blank" href="https://github.com/City-of-Helsinki/servicemap-ui/">
            <Typography className={classes.link} variant="body2">Sovelluksen lähdekoodi</Typography>
          </Link>
        </li>
        <li>
          <Link target="_blank" href="https://github.com/City-of-Helsinki/smbackend/">
            <Typography className={classes.link} variant="body2">Palvelinsovelluksen lähdekoodi</Typography>
          </Link>
        </li>
      </ul>
      <Typography className={classes.text} variant="body2">
        Karttatiedot haetaan avoimesta OpenStreetMapista ja niiden tekijänoikeus kuuluu
        OpenStreetMapin tekijöille. Reittitiedot tuodaan palveluumme HSL:n reittioppaasta.
        Palvelukartan tietoja voit käyttää vapaasti, paitsi veistosten ja julkisen taiteen pisteiden
        valokuvat, jotka ovat tekijänoikeussuojattuja, eikä niitä voi käyttää kaupallisiin
        tarkoituksiin. Rekisteriselosteet löydät kootusti hel.fi sivuilta:&nbsp;
        <Link target="_blank" href="https://www.hel.fi/fi/paatoksenteko-ja-hallinto/tietoa-helsingista/tietosuoja-ja-tiedonhallinta/tietosuoja/tietosuojaselosteet">
          <Typography variant="string">https://www.hel.fi/fi/paatoksenteko-ja-hallinto/tietoa-helsingista/tietosuoja-ja-tiedonhallinta/tietosuoja/tietosuojaselosteet</Typography>
        </Link>
      </Typography>
      <Typography component="h3" variant="body2">Evästeet</Typography>
      <Typography className={classes.text} variant="body2">
        Käytämme sivustollamme evästeitä parantaaksemme sivuston suorituskykyä. Sivustolla kerätään
        alla kuvatut tiedot kävijöistä. Näitä tietoja käytetään sivuston käyttöliittymän ja
        käyttökokemuksen parantamiseen sekä kävijämäärien tilastolliseen seurantaan. Tietoja ei
        luovuteta ulkopuolisille tahoille.
      </Typography>
      <Typography className={classes.text} variant="body2">
        Sivustolla käytetään evästeitä (cookies) käyttäjäistunnon ylläpitämiseksi. Teknisiin
        evästeisiin ei kerätä eikä tallenneta käyttäjän yksilöiviä henkilötietoja.
      </Typography>
      <Typography className={classes.text} variant="body2">
        Käyttäjällä on mahdollisuus estää evästeiden käyttö muuttamalla selaimensa asetuksia.
        Sivuston käyttäminen ilman evästeitä saattaa kuitenkin vaikuttaa sivujen toiminnallisuuteen.
      </Typography>
      <Typography className={classes.text} variant="body2">
        Palvelun kävijätilastointia varten kerätyt tiedot anonymisoidaan, joten niitä ei voida
        liittää yksittäiseen henkilöön. Tällaisia tietoja ovat:
      </Typography>
      <ul>
        <li>
          <Typography variant="body2">IP-osoite, josta verkkosivuille on siirrytty</Typography>
        </li>
        <li>
          <Typography variant="body2">ajankohta</Typography>
        </li>
        <li>
          <Typography variant="body2">palvelussa käytetyt sivut</Typography>
        </li>
        <li>
          <Typography variant="body2">selaintyyppi</Typography>
        </li>
        <li>
          <Typography variant="body2">alueellinen sijaintitieto, josta käyttäjää ei voi yksilöidä.</Typography>
        </li>
      </ul>
      <Typography className={classes.text} variant="body2">
        {'Lisää tietoa palvelun evästeistä: '}
        <Link target="_blank" href="https://www.hel.fi/helsinki/fi/kaupunki-ja-hallinto/tietoa-helsingista/tietoa-hel-fista/turvallisuus">
          Verkkopalvelun tietosuoja ja evästeet | Helsingin kaupunki
        </Link>
      </Typography>
    </div>
  );

  const renderEnglishInfo = () => (
    <div className={classes.textContainer}>
      {localeUrl ? (
        <>
          <Typography component="h3" variant="body2">Accessibility of the Service Map</Typography>
          <ButtonBase className={classes.linkButton} role="link" onClick={() => handleClick()}>
            <Typography color="inherit" variant="body2"><FormattedMessage id="info.statement" /></Typography>
          </ButtonBase>
        </>
      ) : null}
      <Typography component="h3" variant="body2"><FormattedMessage id="app.title" /></Typography>
      <Typography className={classes.text} variant="body2">
        The Service Map contains information on public service locations (for example, schools,
        daycare centres and health stations) in the cities of Espoo, Helsinki, Kauniainen and
        Vantaa, in addition to the wellbeing services counties of Western Uusimaa, Vantaa and
        Kerava.
      </Typography>
      <Typography className={classes.text} variant="body2">
        The Service Map also provides information on other services, such as HUS hospital network
        x-ray units, sports and recreations services in the city of Kirkkonummi, HSY recycling
        points, Aalto University and other governmental services. The Service Map also shows several
        private services via the City Platform service.
      </Typography>
      {
        // Haku
      }
      <Typography component="h3" variant="body2">Search</Typography>
      {/* <Typography className={classes.text} variant="body2"> */}
      <Typography component="h4" variant="body2">
        Use the Service Map to locate, among others, the following
      </Typography>
      <ul>
        <li><Typography variant="body2">health stations</Typography></li>
        <li><Typography variant="body2">schools</Typography></li>
        <li><Typography variant="body2">daycare centres</Typography></li>
        <li><Typography variant="body2">swimming halls</Typography></li>
        <li><Typography variant="body2">playing fields</Typography></li>
        <li><Typography variant="body2">libraries</Typography></li>
        <li><Typography variant="body2">youth centres</Typography></li>
        <li><Typography variant="body2">after-school activities</Typography></li>
        <li><Typography variant="body2">recycling points</Typography></li>
        <li><Typography variant="body2">hospital x-ray units</Typography></li>
        <li><Typography variant="body2">ticket machines for paying for parking</Typography></li>
        <li><Typography variant="body2">public artworks</Typography></li>
        <li><Typography variant="body2">events</Typography></li>
        <li><Typography variant="body2">street addresses</Typography></li>
        <li><Typography variant="body2">civil defence shelters</Typography></li>
      </ul>

      <Typography component="h4" variant="body2">
        Service Map search options:
      </Typography>
      <ul>
        <li>
          <Typography variant="body2">
            Write a word (for example, daycare) in the search field and the service will provide you
            with several suggestions. Choose the suggestion that is most suitable and click Search.
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            Write the specific service (for example, nature trails) you
            are looking for in the search field and click Search or press Enter.
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            If the search doesn’t provide you with the exact information
            you are seeking, you can narrow down the search by clicking Refine
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            You can also narrow down the search by entering a more
            detailed phrase (for example, schools in English) in the search field.
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            Enter a street address or the name of a street near the
            services you are seeking.
          </Typography>
        </li>
      </ul>
      <Typography className={classes.text} variant="body2">
        Click the small x inside the search field to clear the search. Click the arrow within the
        search field to return to the previous search. If your search results come up empty, please
        check your search words for typos and your city setting.
      </Typography>

      <Typography component="h4" variant="body2">Your search results can be arranged in:</Typography>
      <ul>
        <li><Typography variant="body2">alphabetical order, A–Ö</Typography></li>
        <li><Typography variant="body2">reversed alphabetical order Ö–A</Typography></li>
        <li><Typography variant="body2">most accessible first</Typography></li>
        <li><Typography variant="body2">closest first (give permission to locate you)</Typography></li>
      </ul>
      <Typography className={classes.text} variant="body2">
        If you have indicated a sensory processing issue (for example, ‘I use a hearing aid’), a
        search will automatically rank the most accessible services first (in this example, those
        services that provide an induction loop). If you switch off this kind of map setting, your
        search engine ranking order will may change.
      </Typography>
      <Typography className={classes.text} variant="body2">
        If you give the Service Map permission to determine your location, a search request will
        automatically rand the services closest to you first. You can also enter your address in the
        Service Map manually.
      </Typography>

      <Typography component="h3" variant="body2">Address search</Typography>
      <Typography className={classes.text} variant="body2">
        You can also write your address in the search field to find services near you. The search
        field will suggest street names to choose from, and after you have selected one, it will
        suggest specific addresses. The Service Map also generates certain area suggestions for
        Helsinki locations (for example, school catchment areas).
      </Typography>
      <Typography component="h4" variant="body2">Find the following under the heading Services in your area:</Typography>
      <ul>
        <li><Typography variant="body2">health station</Typography></li>
        <li><Typography variant="body2">maternity and child health clinics</Typography></li>
        <li><Typography variant="body2">Finnish and Swedish pre-primary education</Typography></li>
        <li><Typography variant="body2">Finnish and Swedish comprehensive education, grades 1-6</Typography></li>
        <li><Typography variant="body2">Finnish and Swedish comprehensive education, grades 7-9</Typography></li>
        <li><Typography variant="body2">parking areas</Typography></li>
        <li><Typography variant="body2">postal code areas</Typography></li>
        <li><Typography variant="body2">neighbourhoods</Typography></li>
        <li><Typography variant="body2">civil defence districts</Typography></li>
        <li><Typography variant="body2">civil defence sections</Typography></li>
        <li><Typography variant="body2">civil defence subsections</Typography></li>
        <li><Typography variant="body2">nature conservation areas</Typography></li>
      </ul>

      <Typography component="h3" variant="body2">Services list</Typography>
      <Typography className={classes.text} variant="body2">
        The Services list contains each of the headings Service Map uses. You can use the list to
        find one or more service entities (for example, Outdoor sports parks or Daycare). Once you
        have selected the service headings you seek, remember to click Perform search.
      </Typography>

      <Typography component="h3" variant="body2">My settings</Typography>
      <Typography className={classes.text} variant="body2">
        You can find the Settings options under the header the top of the main page and also under
        the search field. You can adjust the settings by clicking on any of the statements that
        apply to you:
      </Typography>
      <ul>
        <li><Typography variant="body2">Hearing and sight:</Typography></li>
        <ul>
          <li><Typography variant="body2">I use hearing aid</Typography></li>
          <li><Typography variant="body2">I am visually impaired</Typography></li>
          <li><Typography variant="body2">I have a colour vision deficiency </Typography></li>
        </ul>
        <li><Typography variant="body2">Mobility impairments:</Typography></li>
        <ul>
          <li><Typography variant="body2">I use a wheelchair</Typography></li>
          <li><Typography variant="body2">I have reduced mobility</Typography></li>
          <li><Typography variant="body2">I use a rollator</Typography></li>
          <li><Typography variant="body2">I push a stroller</Typography></li>
        </ul>
        <li><Typography variant="body2">City settings:</Typography></li>
        <ul>
          <li><Typography variant="body2">Helsinki</Typography></li>
          <li><Typography variant="body2">Espoo</Typography></li>
          <li><Typography variant="body2">Vantaa</Typography></li>
          <li><Typography variant="body2">Kauniainen</Typography></li>
          <li><Typography variant="body2">Kirkkonummi</Typography></li>
        </ul>
      </ul>

      <Typography className={classes.text} variant="body2">
        If you select a mobility issue setting, your searches will show you first which locations
        allow easy access with, for example, a rollator, and what specific accessibility issues that
        location may have.
      </Typography>
      <Typography className={classes.text} variant="body2">
        If you choose a specific city in the city settings, the service will only show you data
        associated with that city. If you do not select any city, the service will generate data
        about all the cities.
      </Typography>

      <Typography component="h4" variant="body2">Map Tools</Typography>
      <Typography className={classes.text} variant="body2">
        Under the Map Tools heading, you will find a selection of helpful Service Map
        functionalities that can enhance your use of the service. These include:
      </Typography>
      <ul>
        <li><Typography variant="body2">Embedding tool</Typography></li>
        <li><Typography variant="body2">Download data</Typography></li>
        <li><Typography variant="body2">Print</Typography></li>
        <li><Typography variant="body2">Measure distance with a mouse</Typography></li>
      </ul>

      <Typography component="h4" variant="body2">Background Map settings</Typography>
      <Typography className={classes.text} variant="body2">
        Several settings are also available for the background map. These include:
      </Typography>
      <ul>
        <li><Typography variant="body2">Service map default</Typography></li>
        <li><Typography variant="body2">Aerial view</Typography></li>
        <li><Typography variant="body2">Guide map</Typography></li>
        <li><Typography variant="body2">High-contrast map</Typography></li>
      </ul>

      <Typography component="h3" variant="body2">Feedback</Typography>
      <Typography className={classes.text} variant="body2">
        {'We are grateful for all feedback, as it helps us to make the Service Map even better. You can send general feedback about the service to the service developers at '}
        <Link target="_blank" href="https://palvelukartta.hel.fi/en/feedback">
          <Typography variant="string">https://palvelukartta.hel.fi/en/feedback</Typography>
        </Link>
        {' (opens in new tab).'}
      </Typography>
      <Typography className={classes.text} variant="body2">
        You can also send feedback directly to the individual service locations. After you have
        selected the service location in question, you will find a Give feedback button at the
        bottom of the Information column on the left side of the screen.
      </Typography>

      <Typography component="h3" variant="body2">Data and copyrights</Typography>
      <Typography className={classes.text} variant="body2">
        The Service Map has been developed as extensively as possible by using open data and open
        APIs. The source code is available in GitHub, and everyone is encouraged to participate in
        its development.
      </Typography>
      <ul>
        <li>
          <Link target="_blank" href="https://github.com/City-of-Helsinki/servicemap-ui/">
            <Typography className={classes.link} variant="body2">Source code for the application</Typography>
          </Link>
        </li>
        <li>
          <Link target="_blank" href="https://github.com/City-of-Helsinki/smbackend/">
            <Typography className={classes.link} variant="body2">Source code for the server application</Typography>
          </Link>
        </li>
      </ul>
      <Typography className={classes.text} variant="body2">
        The data provided by the service is compiled from OpenStreetMap, whose copyright belongs to
        its makers. Information on public transport journeys is compiled from Helsinki Region
        Transport’s Journey Planner service. Service Map data can be used freely, with the exception
        of photos of public artworks, which are protected by copyright and cannot be used for
        commercial purposes.
      </Typography>
      <Typography className={classes.text} variant="body2">
        {'File descriptions can be found on the City of Helsinki website at: '}
        <Link target="_blank" href="https://www.hel.fi/fi/paatoksenteko-ja-hallinto/tietoa-helsingista/tietosuoja-ja-tiedonhallinta/tietosuoja/tietosuojaselosteet">
          <Typography variant="string">https://www.hel.fi/fi/paatoksenteko-ja-hallinto/tietoa-helsingista/tietosuoja-ja-tiedonhallinta/tietosuoja/tietosuojaselosteet</Typography>
        </Link>
      </Typography>

      <Typography component="h3" variant="body2">Cookies</Typography>
      <Typography className={classes.text} variant="body2">
        We use cookies on our website to improve the site’s performance. The data collected about visitors to the site is described below. It is used to improve the user interface and user experience, and to monitor the number of visitors to the site. This data is not handed over to external parties.
      </Typography>
      <Typography className={classes.text} variant="body2">
        The site uses cookies to maintain the user session. No personal data that could identify the user is collected or recorded in the technical cookies.
      </Typography>
      <Typography className={classes.text} variant="body2">
        Website users are free to reject the use of cookies by changing the browser settings. This may affect the functionality of the pages, however.
      </Typography>
      <Typography className={classes.text} variant="body2">
        Data collected for visitor statistics is made anonymous, so it cannot be traced back to individuals. This data includes:
      </Typography>

      <ul>
        <li>
          <Typography variant="body2">the IP address used to access the website</Typography>
        </li>
        <li>
          <Typography variant="body2">the time the service was accessed</Typography>
        </li>
        <li>
          <Typography variant="body2">the pages used in the service</Typography>
        </li>
        <li>
          <Typography variant="body2">the type of browser</Typography>
        </li>
        <li>
          <Typography variant="body2">regional location data, which cannot be used to identify the user</Typography>
        </li>
      </ul>
      <Typography className={classes.text} variant="body2">
        {'Read more about the service cookies on the '}
        <Link target="_blank" href="https://www.hel.fi/en/decision-making/information-on-helsinki/data-protection-and-information-management/data-protection">
          City of Helsinki website pages on Data protection.
        </Link>
      </Typography>
    </div>
  );

  const renderSwedishInfo = () => (
    <div className={classes.textContainer}>
      {localeUrl ? (
        <>
          <Typography component="h3" variant="body2">Servicekartans tillgänglighet</Typography>
          <ButtonBase className={classes.linkButton} role="link" onClick={() => handleClick()}>
            <Typography color="inherit" variant="body2"><FormattedMessage id="info.statement" /></Typography>
          </ButtonBase>
        </>
      ) : null}
      <Typography component="h3" variant="body2"><FormattedMessage id="app.title" /></Typography>
      <Typography className={classes.text} variant="body2">
        På Servicekartan hittar du offentliga verksamhetsställen och service i Esbo, Grankulla, Helsingfors,
        Vanda och Kyrkslätt stad - exempelvis skolor, daghem och hälsostationer.
        På Servicekartan finns även andra offentliga tjänster, såsom HUS service (t.ex. röntgen), HRM:s tjänster
        (t.ex. återvinningsstationer), Aalto-universitetets tjänster samt diverse statliga tjänster. Privata tjänster
        såsom turistobjekt (t.ex. restauranger) kommer till Servicekartan via MyHelsinki-gränssnittet.
      </Typography>
      <Typography component="h3" variant="body2">Sökning</Typography>
      <Typography component="h4" variant="body2">På Servicekartan kan du söka exempelvis:</Typography>
      <ul>
        <li><Typography variant="body2">hälsostationer</Typography></li>
        <li><Typography variant="body2">skolor</Typography></li>
        <li><Typography variant="body2">daghem</Typography></li>
        <li><Typography variant="body2">simhallar</Typography></li>
        <li><Typography variant="body2">bollplaner</Typography></li>
        <li><Typography variant="body2">bibliotek</Typography></li>
        <li><Typography variant="body2">ungdomsgårdar</Typography></li>
        <li><Typography variant="body2">verksamhetsställen för eftis</Typography></li>
        <li><Typography variant="body2">återvinningsstationer</Typography></li>
        <li><Typography variant="body2">röntgenställen</Typography></li>
        <li><Typography variant="body2">röntgenställen</Typography></li>
        <li><Typography variant="body2">röntgenställen</Typography></li>
        <li><Typography variant="body2">dessutom kan du söka evenemang som ordnas på verksamhetsställena</Typography></li>
        <li><Typography variant="body2">gatuadresser</Typography></li>
      </ul>
      <Typography className={classes.text} variant="body2">
        Skriv valfritt sökord i Servicekartans sökfält. Tjänsten ger dig förslag av vilka du kan välja det lämpligaste. Du
        kan också skriva hela sökordet och klicka på Sök eller använda tangenten enter. Om det visas för många
        resultat från sökningen kan du begränsa sökningen genom att klicka på ”Precisera”. Du kan också söka med
        flera ord, t.ex. ”skola spanska”.
      </Typography>
      <Typography className={classes.text} variant="body2">
        Om du inte får lämpliga sökresultat, kolla rättstavningen och valet av stad. Ange en adress i närheten av var
        du söker service. Ange nyckelord såsom ”naturstig” eller ”svenskspråkigt daghem” I sökfältet finns ett kryss
        med vilket du kan rensa sökningen. Med pilen i Servicekartans sökfält återvänder du till föregående vy.
      </Typography>
      <Typography component="h4" variant="body2">Du kan ordna sökresultaten enligt följande:</Typography>
      <ul>
        <li><Typography variant="body2">Bästa träffen först</Typography></li>
        <li><Typography variant="body2">Alfabetisk ordning, A-Ö</Typography></li>
        <li><Typography variant="body2">Omvänd alfabetisk ordning, Ö-A</Typography></li>
        <li><Typography variant="body2">Tillgängligast först</Typography></li>
        <li><Typography variant="body2">Närmaste först (ge Servicekartan lov att lokalisera dig)</Typography></li>
      </ul>
      {/* </Typography> */}
      <Typography component="h3" variant="body2">Adressökning</Typography>
      <Typography className={classes.text} variant="body2">
        Du kan också söka med en adress där du vill hitta service. Sökningen föreslår dig adresser och områden. Du
        kan också skriva hela adressen.
      </Typography>
      <Typography component="h4" variant="body2">På fliken ”Områden” finns följande tjänster:</Typography>
      <ul>
        <li><Typography variant="body2">hälsocentral</Typography></li>
        <li><Typography variant="body2">rådgivningsbyrå</Typography></li>
        <li><Typography variant="body2">finskspråkig förskola</Typography></li>
        <li><Typography variant="body2">finskspråkigt lågstadium</Typography></li>
        <li><Typography variant="body2">finskspråkigt högstadium</Typography></li>
        <li><Typography variant="body2">svenskpråkig förskola</Typography></li>
        <li><Typography variant="body2">svenskspråkigt högstadium</Typography></li>
        <li><Typography variant="body2">räddningsstation</Typography></li>
        <li><Typography variant="body2">närmaste befolkningslarm</Typography></li>
        <li><Typography variant="body2">närliggande skyddsrum</Typography></li>
      </ul>
      <Typography component="h3" variant="body2">Servicekatalog</Typography>
      <Typography className={classes.text} variant="body2">
        Du når servicekatalogen genom att klicka på framsidan ”Läs mer om servicen i servicekatalogen”. I
        servicekatalogen finns ett träddiagram i vilket du kan söka en eller flera servicehelheter, såsom ”motion”,
        ”yrkesutbildning” och ”barndagvård”. Du kan också ta bort dina val.
      </Typography>
      <Typography component="h3" variant="body2">Inställningar</Typography>
      <Typography className={classes.text} variant="body2">I sidans övre meny hittar du följande inställningar:</Typography>
      <Typography component="h4" variant="body2">Tillgänglighetsinställningar</Typography>
      <Typography className={classes.text} variant="body2">Här kan du välja de alternativ som passar dig bäst</Typography>
      <ul>
        <li>
          <Typography variant="body2">Hörsel och syn::</Typography>
          <ul>
            <li><Typography variant="body2">jag använder hörapparat</Typography></li>
            <li><Typography variant="body2">jag är synskadad</Typography></li>
            <li><Typography variant="body2">jag har svårt att urskilja färger</Typography></li>
          </ul>
        </li>
        <li>
          <Typography variant="body2">Rörelsehinder:</Typography>
          <ul>
            <li><Typography variant="body2">jag använder rullstol</Typography></li>
            <li><Typography variant="body2">jag har rörelsehinder</Typography></li>
            <li><Typography variant="body2">jag använder rollator</Typography></li>
            <li><Typography variant="body2">jag går med barnvagn</Typography></li>
          </ul>
        </li>
      </ul>
      <Typography className={classes.text} variant="body2">
        Om du väljer tillgänglighetsinställningar visar sidan för det verksamhetsställe du sökt exempelvis hur du når
        stället med rollator och vilka eventuella hinder där finns.
      </Typography>
      <Typography component="h4" variant="body2">Stadsinställningar</Typography>
      <Typography className={classes.text} variant="body2">
        Här kan du välja antingen en eller flera av följande städer: Esbo, Grankulla, Helsingfors, Vanda. Om du väljer
        en stad så visas det endast sökresultat från denna stads data. Om du inte väljer någon stad så gäller
        sökningen alla städer.
      </Typography>
      <Typography component="h4" variant="body2">Kartunderlagets inställningar</Typography>
      <Typography className={classes.text} variant="body2">Välj kartunderlag</Typography>
      <ul>
        <li><Typography variant="body2">servicekartan</Typography></li>
        <li><Typography variant="body2">karta med stora kontraster</Typography></li>
        <li><Typography variant="body2">guidekartan</Typography></li>
      </ul>
      {/* <Typography className={classes.text} variant="body2">
        in the accessibility settings you have chosen “I am visually impaired” or “I have color vision deficiency”,
        then the background map will automatically change into a high-contrast background map. You can change
        the background map in the settings.
      </Typography> */}
      <Typography component="h3" variant="body2">Respons</Typography>
      <Typography className={classes.text} variant="body2">
        Vi tackar för all respons som hjälper oss att göra Servicekartan ännu bättre.
        Du kan ge allmän respons om Servicekartan till dess utvecklare på:
        Hel.fi/respons
        Du kan ge respons för ett verksamhetsställe direkt via Servicekartan. Välj ett verksamhetsställe, du hittar
        responsblanketten från ställets flik för basuppgifter.
      </Typography>
      <Typography component="h3" variant="body2">Uppgifter och upphovsrätter</Typography>
      <Typography className={classes.text} variant="body2">
        Servicekartan har skapats med öppna data och öppna gränssnitt. Servicen utvecklas som ett offentligt
        projekt med öppen källkod.
        Källkoden för både användargränssnittet och serverapplikationen är öppna i tjänsten GitHub, där vem som
        helst kan delta i att utveckla dem.
      </Typography>
      <ul>
        <li>
          <Link target="_blank" href="https://github.com/City-of-Helsinki/servicemap-ui/">
            <Typography className={classes.link} variant="body2">Användargränssnittets källkod  </Typography>
          </Link>
        </li>
        <li>
          <Link target="_blank" href="https://github.com/City-of-Helsinki/smbackend/">
            <Typography className={classes.link} variant="body2">Serverapplikationens källkod</Typography>
          </Link>
        </li>
      </ul>
      <Typography className={classes.text} variant="body2">
        Tjänsternas och verksamhetsställenas uppgifter är öppna data som kan användas via gränssnittet
        REST, som producerar Servicekartans serverapplikation. Servicekartans information kan fritt
        användas, förutom fotografier av statyer och offentlig konst. Dessa skyddas av upphovsrätten och får inte
        användas för kommersiella ändamål.
        Kartunderlaget ”Servicekartan” och ”Karta med stora kontraster” bildas från den öppna tjänstens
        data, vars upphovsrätt tillhör tillverkarna av OpenStreetMap.
        Registerbeskrivningarna har samlats på stadens webbplats.
        Läs mer under ”Huvudstadsregionens register över verksamhetsställen och service” och ”Register över
        delaktighet och respons”.
      </Typography>
      <Typography className={classes.text} variant="body2">
        Servicen har utarbetats vid Helsingfors stadskanslis informationsförvaltningsenhet.
      </Typography>
      <Typography component="h3" variant="body2">Cookies</Typography>
      <Typography className={classes.text} variant="body2">
        Vi använder cookies på vår webbplats för att förbättra webbplatsens prestanda och innehåll. På webbplatsen samlar vi automatiskt in nedan beskrivna uppgifter om besökarna. Dessa uppgifter används för att förbättra webbplatsens användargränssnitt och användarupplevelsen samt för statistisk uppföljning av antalet besökare. Uppgifterna lämnas inte ut till utomstående.På webbplatsen används cookies för att upprätthålla användarsessionen. Tekniska cookies varken samlar eller lagrar identifierande personuppgifter.
        Användaren kan neka användningen av cookies i webbläsarens inställningar. Att använda webbplatsen utan cookies kan dock påverka sidornas funktioner.
        Uppgifterna som samlas in för besöksstatistik om tjänsten anonymiseras så att de inte kan kopplas till enskilda personer. Sådana uppgifter är:
      </Typography>
      <ul>
        <li>
          <Typography variant="body2">IP-adressen från vilken besökaren kommer till webbplats</Typography>
        </li>
        <li>
          <Typography variant="body2">tidpunkt</Typography>
        </li>
        <li>
          <Typography variant="body2">vilka sidor användaren besökt i tjänsten</Typography>
        </li>
        <li>
          <Typography variant="body2">typ av webbläsare</Typography>
        </li>
        <li>
          <Typography variant="body2">regionala platsdata som inte kan användas för att identifiera användaren.</Typography>
        </li>
      </ul>
      <Typography className={classes.text} variant="body2">
        {'Läs mera om Helsingfors webbtjänstens dataskydd: '}
        <Link target="_blank" href="https://www.hel.fi/helsinki/sv/stad-och-forvaltning/information/information/sakerhet">
          Webbtjänstens dataskydd | Helsingfors stad
        </Link>
      </Typography>
    </div>
  );

  const version = config.version || '';
  const commit = config.commit ? `${config.commit}` : '';
  const versionText = `Version: ${version} ${(config.version && config.commit) ? '-' : ''} ${commit}`;

  return (
    <div>
      <div className={classes.pageContainer}>
        {renderTitlebar()}
        {locale === 'fi' && (
          renderFinnishInfo()
        )}
        {locale === 'en' && (
          renderEnglishInfo()
        )}
        {locale === 'sv' && (
          renderSwedishInfo()
        )}
        <NoSsr>
          {config.version || config.commit
            ? <Typography align="left" aria-hidden="true" className={classes.text}>{versionText}</Typography>
            : null}
        </NoSsr>
      </div>
    </div>
  );
};

// Typechecking
InfoView.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  locale: PropTypes.string.isRequired,
};

export default InfoView;
