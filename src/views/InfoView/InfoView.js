/* eslint-disable max-len */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Typography, ButtonBase, Link, NoSsr,
} from '@material-ui/core';
import TitleBar from '../../components/TitleBar';
import config from '../../../config';

const InfoView = ({ classes, locale }) => {
  const a11yURLs = config.accessibilityStatementURL;
  const localeUrl = !a11yURLs[locale] || a11yURLs[locale] === 'undefined' ? null : a11yURLs[locale];

  const handleClick = () => {
    window.open(localeUrl);
  };

  const renderTitlebar = () => (
    <TitleBar
      sticky
      ariaHidden
      backButton
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
        Palvelukartalta löydät Espoon, Helsingin, Kauniaisten, Vantaan ja Kirkkonummen julkiset toimipisteet ja niiden palvelut.
        Esimerkiksi koulut, päiväkodit, terveysasemat. Palvelukartalta löytyy myös muitakin palveluja, esimerkiksi
        HUSin (esimerkiksi röntgenit), HSY:n (esimerkiksi kierrätyspisteet), Aalto-yliopiston ja muita valtion
        palveluja. Yksityisiä palveluja, esimerkiksi turistikohteita (esimerkiksi ravintoloita) tulee palvelukartalle
        MyHelsinki-rajapinnan kautta.
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
      </ul>
      <Typography className={classes.text} variant="body2">
        Kirjoita palvelukartan hakukenttään haluamasi sana. Saat hakuehdotuksia, joista voit valita itsellesi sopivan.
        Voit myös kirjoittaa hakemasi sanan loppuun ja painaa Hae –painiketta tai Enter näppäimistöltä. Jos
        hakutulos ei ollut hyvä, voit tarkentaa hakua Tarkenna –painikkeella. Voit hakea myös usean sanan
        yhdistelmällä, esimerkiksi ”koulu espanja”.
      </Typography>
      <Typography className={classes.text} variant="body2">
        Jos hakutulos on tyhjä, tarkista kirjoitusasu ja kaupunkivalinnat. Kirjoita osoite, minkä läheltä etsit palvelua.
        Kirjoita avainsanoja, esim ”luontopolku”, ”ruotsinkielinen päiväkoti”. Hakukentässä on ruksi, jota
        painamalla voit tyhjentää haun. Palvelukartan hakukentän nuolipainikkeella voit palata edelliseen
        näkymään.
      </Typography>
      <Typography component="h4" variant="body2">Voit järjestää hakutulokset:</Typography>
      <ul>
        <li><Typography variant="body2">osuvin ensin</Typography></li>
        <li><Typography variant="body2">aakkosjärjestys, A-Ö</Typography></li>
        <li><Typography variant="body2">käänteinen aakkosjärjestys Ö-A</Typography></li>
        <li><Typography variant="body2">esteettömin ensin</Typography></li>
        <li><Typography variant="body2">lähin ensin (anna palvelukartalle lupa paikantaa sinut)</Typography></li>
      </ul>
      {/* </Typography> */}
      <Typography component="h3" variant="body2">Osoitehaku</Typography>
      <Typography className={classes.text} variant="body2">
        Voit kirjoittaa hakukenttään myös osoitteen, josta haluat etsiä palveluja. Haku antaa sinulle osoite- ja alue-
        ehdotuksia. Voit myös kirjoittaa osoitteen loppuun saakka.
      </Typography>
      <Typography component="h4" variant="body2">Näet välilehdellä ”Alueet”, seuraavat palvelut:</Typography>
      <ul>
        <li><Typography variant="body2">terveyskeskus</Typography></li>
        <li><Typography variant="body2">neuvola</Typography></li>
        <li><Typography variant="body2">suomenkielinen esiopetus</Typography></li>
        <li><Typography variant="body2">suomenkielinen ala-aste</Typography></li>
        <li><Typography variant="body2">suomenkielinen yläaste</Typography></li>
        <li><Typography variant="body2">ruotsinkielinen esiopetus</Typography></li>
        <li><Typography variant="body2">ruotsinkielinen yläaste</Typography></li>
        <li><Typography variant="body2">pelastusasema</Typography></li>
        <li><Typography variant="body2">lähin väestöhälytin</Typography></li>
        <li><Typography variant="body2">lähellä olevat yhteiskalliosuojat</Typography></li>
      </ul>
      <Typography component="h4" variant="body2">Alueet ja piirit, joihin osoite kuuluu:</Typography>
      <ul>
        <li><Typography variant="body2">postinumeroalue</Typography></li>
        <li><Typography variant="body2">kaupunginosa</Typography></li>
        <li><Typography variant="body2">terveysasema- alue</Typography></li>
        <li><Typography variant="body2">neuvola-alue</Typography></li>
        <li><Typography variant="body2">suomenkielinen esiopetusalue</Typography></li>
        <li><Typography variant="body2">suomenkielinen ala-astealue</Typography></li>
        <li><Typography variant="body2">suomenkielinen yläastealue</Typography></li>
        <li><Typography variant="body2">ruotsinkielinen esiopetusalue</Typography></li>
        <li><Typography variant="body2">ruotsinkielinen ala-astealue</Typography></li>
        <li><Typography variant="body2">ruotsinkielinen yläastealue</Typography></li>
        <li><Typography variant="body2">suojelupiiri</Typography></li>
        <li><Typography variant="body2">suojelulohko</Typography></li>
        <li><Typography variant="body2">suojelu alalohko</Typography></li>
      </ul>
      <Typography component="h3" variant="body2">Palveluluettelo</Typography>
      <Typography className={classes.text} variant="body2">
        Palveluluettelo löytyy palvelukartan etusivulta.
        Voit siinä etsiä palvelupuun avulla yhtä tai useampaa palvelukokonaisuutta.
        Esim. lähiliikunta, liikuntapuistot ja päiväkoti. Voit poistaa tekemiäsi valintoja.
      </Typography>
      <Typography component="h3" variant="body2">Asetukset</Typography>
      <Typography className={classes.text} variant="body2">Sivun ylävalikosta löydät seuraavat asetukset:</Typography>
      <Typography component="h4" variant="body2">Esteettömyysasetukset</Typography>
      <Typography className={classes.text} variant="body2">Täältä voit valita seuraavista rajoitteista itsellesi sopivan asetuksen</Typography>
      <ul>
        <li>
          <Typography variant="body2">Aistirajoitteet:</Typography>
          <ul>
            <li><Typography variant="body2">käytän kuulolaitetta</Typography></li>
            <li><Typography variant="body2">olen näkövammainen</Typography></li>
            <li><Typography variant="body2">minun on vaikea erottaa värejä</Typography></li>
          </ul>
        </li>
        <li>
          <Typography variant="body2">Liikkumisrajoitteet:</Typography>
          <ul>
            <li><Typography variant="body2">käytän pyörätuolia</Typography></li>
            <li><Typography variant="body2">olen liikkumisesteinen</Typography></li>
            <li><Typography variant="body2">käytän rollaattoria</Typography></li>
            <li><Typography variant="body2">työnnän rattaita</Typography></li>
          </ul>
        </li>
      </ul>
      <Typography className={classes.text} variant="body2">
        Jos valitset jonkin esteettömyysasetuksen, hakemasi toimipistesivu näyttää sinulle esimerkiksi,
        miten pääset rollaattorilla toimipisteeseen ja mitkä ovat mahdolliset esteet siellä
      </Typography>
      <Typography component="h4" variant="body2">Kaupunkiasetukset</Typography>
      <Typography className={classes.text} variant="body2">
        Täältä voit valita joko yhden tai useamman seuraavista kaupungeista: Espoo, Helsinki, Kauniainen, Vantaa, Kirkkonummi
        Kun valitset jonkin kaupungin, hakutulokset kohdistuvat ainoastaan tämän kaupungin tietoihin.
        Jos et ole valinnut yhtäkään kaupunkia, haku kohdistuu kaikkiin kaupunkeihin.
      </Typography>
      <Typography component="h4" variant="body2">Karttapohjan asetukset</Typography>
      <Typography className={classes.text} variant="body2">Voit valita karttapohjaksi</Typography>
      <ul>
        <li><Typography variant="body2">palvelukartta</Typography></li>
        <li><Typography variant="body2">suurikontrastinen kartta</Typography></li>
        <li><Typography variant="body2">opaskartta</Typography></li>
      </ul>
      {/* <Typography className={classes.text} variant="body2">
        in the accessibility settings you have chosen “I am visually impaired” or “I have color vision deficiency”,
        then the background map will automatically change into a high-contrast background map. You can change
        the background map in the settings.
      </Typography> */}
      <Typography component="h3" variant="body2">Palaute</Typography>
      <Typography className={classes.text} variant="body2">
        Kiitämme kaikesta palautteesta, jotta voimme kehittää Palvelukarttaa yhä paremmaksi.
        Voit lähettää palvelukartasta yleistä palautetta palvelukartan kehittäjille:
        Hel.fi/palaute (linkki, avautuu uudella välilehdellä)
        Voit lähettää toimipisteeseen liittyvää palautetta suoraan palvelukartan toimipistesivulta.
        Hae haluamasi toimipiste, niin löydät palautelomakkeen toimipisteen tiedoista perustiedot –välilehdeltä.
      </Typography>
      <Typography component="h3" variant="body2">Tiedot ja tekijänoikeudet</Typography>
      <Typography className={classes.text} variant="body2">
        Palvelukartta on rakennettu mahdollisimman täydellisesti avointa dataa ja avointa lähdekoodia käyttäen.
        Kartan lähdekoodi löytyy GitHubista ja sen kehittämiseen rohkaistaan.
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
        Karttatiedot haetaan avoimesta OpenStreetMapista ja niiden tekijänoikeus kuuluu OpenStreetMapin tekijöille.
        Reittitiedot tuodaan palveluumme HSL:n reittioppaasta.
        Palvelukartan tietoja voit käyttää vapaasti, paitsi veistosten ja julkisen taiteen pisteiden valokuvat,
        jotka ovat tekijänoikeussuojattuja, eikä niitä voi käyttää kaupallisiin tarkoituksiin.
        Rekisteriselosteet löydät kootusti hel.fi-portaalista.
        Katso kohdat Kaupunginkanslia: Toimipisterekisterin keskitetty tietovarasto ja Helsingin kaupungin palautejärjestelmä.
      </Typography>
      <Typography component="h3" variant="body2">Evästeet</Typography>
      <Typography className={classes.text} variant="body2">
        Käytämme sivustollamme evästeitä parantaaksemme sivuston suorituskykyä. Sivustolla kerätään automaattisesti alla kuvatut tiedot kävijöistä. Näitä tietoja käytetään sivuston käyttöliittymän ja käyttökokemuksen parantamiseen sekä kävijämäärien tilastolliseen seurantaan. Tietoja ei luovuteta ulkopuolisille tahoille. Sivustolla käytetään evästeitä (cookies) käyttäjäistunnon ylläpitämiseksi. Teknisiin evästeisiin ei kerätä eikä tallenneta käyttäjän yksilöiviä henkilötietoja.
        Käyttäjällä on mahdollisuus estää evästeiden käyttö muuttamalla selaimensa asetuksia. Sivuston käyttäminen ilman evästeitä saattaa kuitenkin vaikuttaa sivujen toiminnallisuuteen.
        Palvelun kävijätilastointia varten kerätyt tiedot anonymisoidaan, joten niitä ei voida liittää yksittäiseen henkilöön. Tällaisia tietoja ovat:
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
        On the Service Map, you can find the public services units of the cities of Espoo, Helsinki, Kauniainen,
        Vantaa and Kirkkonummi, and their services – for example, schools, day-care centres and health stations.
        On the Service Map, there are other public services as well, such as HUS&apos;s services (for example, X-
        rays), Helsinki Region Environmental Services Authority’s services (e.g. recycling sites), Aalto University’s
        services as well as other governmental services. Individual services such as tourist attractions (for example
        restaurants) are added to the Service Map through the MyHelsinki API.
      </Typography>
      {
        // Haku
      }
      <Typography component="h3" variant="body2">Search</Typography>
      {/* <Typography className={classes.text} variant="body2"> */}
      <Typography component="h4" variant="body2">On the Service Map, you can search for, for example</Typography>
      <ul>
        <li><Typography variant="body2">health stations</Typography></li>
        <li><Typography variant="body2">schools</Typography></li>
        <li><Typography variant="body2">schools</Typography></li>
        <li><Typography variant="body2">swimming halls</Typography></li>
        <li><Typography variant="body2">playing fields</Typography></li>
        <li><Typography variant="body2">libraries</Typography></li>
        <li><Typography variant="body2">youth premises</Typography></li>
        <li><Typography variant="body2">service units for afternoon activities</Typography></li>
        <li><Typography variant="body2">recycling sites</Typography></li>
        <li><Typography variant="body2">X-ray stations</Typography></li>
        <li><Typography variant="body2">parking ticket machines</Typography></li>
        <li><Typography variant="body2">public sculptures and statues</Typography></li>
        <li><Typography variant="body2">In addition to services and service units, you can also search for events arranged at the service units</Typography></li>
        <li><Typography variant="body2">street addresses</Typography></li>
      </ul>
      <Typography className={classes.text} variant="body2">
        Write a word in the search field of the Service Map. You get search suggestions, from which you can choose
        one of your liking. You can also write your search word at the end and press the Search button or the enter
        key on the keyboard If there are too many search results, you can refine your search by clicking the
        “Refine” button. You can also search using a multi-word combination, for example “school Spanish”.
      </Typography>
      <Typography className={classes.text} variant="body2">
        If there are not adequate search results, check the spelling and city choices. Write the address around
        which you are looking for a service. Write keywords, such as “nature trail” or “Day-care centre English”. The
        search field has a cross that clears the search. You can use the arrow in the search field of the Service Map
        to return to the previous view.
      </Typography>
      <Typography component="h4" variant="body2">You can arrange the search results:</Typography>
      <ul>
        <li><Typography variant="body2">best match first</Typography></li>
        <li><Typography variant="body2">alphabetical order, A–Ö</Typography></li>
        <li><Typography variant="body2">reversed alphabetical order Ö–A</Typography></li>
        <li><Typography variant="body2">most accessible first</Typography></li>
        <li><Typography variant="body2">closest first (give permission to locate you)</Typography></li>
      </ul>
      <Typography component="h3" variant="body2">Address search</Typography>
      <Typography className={classes.text} variant="body2">
        In the search field, you can also write an address, from which you want to look for services. The search also
        gives you address and area suggestions. You can also write the address until the end.
      </Typography>
      <Typography component="h4" variant="body2">On the “Areas” tab, you can see the following services:</Typography>
      <ul>
        <li><Typography variant="body2">health station</Typography></li>
        <li><Typography variant="body2">maternity clinic</Typography></li>
        <li><Typography variant="body2">pre-primary education in Finnish</Typography></li>
        <li><Typography variant="body2">primary school in Finnish, grades 1-6</Typography></li>
        <li><Typography variant="body2">primary school in Finnish, grades 7-9</Typography></li>
        <li><Typography variant="body2">pre-primary education in Swedish</Typography></li>
        <li><Typography variant="body2">primary school in Swedish, grades 7-9</Typography></li>
        <li><Typography variant="body2">rescue station</Typography></li>
        <li><Typography variant="body2">lähin väestöhälytin</Typography></li>
        <li><Typography variant="body2">closest civil defence siren</Typography></li>
        <li><Typography variant="body2">common civil defence shelters nearby</Typography></li>
      </ul>
      <Typography component="h3" variant="body2">Services list</Typography>
      <Typography className={classes.text} variant="body2">
        You can access the services list by clicking the “Get to know the services using the Services list” button on
        the main page of the Service Map. Using the service tree of the Services list, you can search for one or
        several service groups, for example, “sports”, “vocational education” and “child day-care”. You can also
        erase your choices.
      </Typography>
      <Typography component="h3" variant="body2">Settings</Typography>
      <Typography className={classes.text} variant="body2">In the upper menu of the page, you can find the following settings:</Typography>
      <Typography component="h4" variant="body2">Accessibility settings</Typography>
      <Typography className={classes.text} variant="body2">Here you can choose the settings that you like from the following alternatives</Typography>
      <ul>
        <li>
          <Typography variant="body2">Hearing and sight:</Typography>
          <ul>
            <li><Typography variant="body2">I use hearing aid</Typography></li>
            <li><Typography variant="body2">I am visually impaired</Typography></li>
          </ul>
        </li>
        <li>
          <Typography variant="body2">Mobility impairments:</Typography>
          <ul>
            <li><Typography variant="body2">I use a wheelchair</Typography></li>
            <li><Typography variant="body2">I have reduced mobility</Typography></li>
            <li><Typography variant="body2">I use a rollator</Typography></li>
            <li><Typography variant="body2">I push a stroller</Typography></li>
          </ul>
        </li>
      </ul>
      <Typography className={classes.text} variant="body2">
        If you choose an accessibility setting, the service unit page shows you, for example, how you can access the
        unit with a rollator and what the possible obstacles are.
      </Typography>
      <Typography component="h4" variant="body2">City settings</Typography>
      <Typography className={classes.text} variant="body2">
        Here you can choose one or several of the cities: Espoo, Helsinki, Kauniainen, Vantaa, Kirkkonummi. When you choose a
        city, the search results concern only this city’s data. If you have not chosen a city, then the search concerns
        all cities.
      </Typography>
      <Typography component="h4" variant="body2">The background map settings</Typography>
      <Typography className={classes.text} variant="body2">As the background map, you can choose</Typography>
      <ul>
        <li><Typography variant="body2">Service map</Typography></li>
        <li><Typography variant="body2">High-contrast map</Typography></li>
        <li><Typography variant="body2">Guide map</Typography></li>
      </ul>
      <Typography className={classes.text} variant="body2">
        in the accessibility settings you have chosen “I am visually impaired” or “I have color vision deficiency”,
        then the background map will automatically change into a high-contrast background map. You can change
        the background map in the settings.
      </Typography>
      <Typography component="h3" variant="body2">Feedback</Typography>
      <Typography className={classes.text} variant="body2">
        We thank you for all feedback, in order for us to be able to make the Service Map even better.
        You can send general feedback on the Service Map to the developers:
        Hel.fi/feedback
        You can send feedback concerning the service unit directly from the service unit page of the Service
        Map. Search for a service unit to find the feedback form on the basic information tab of the service unit data.
      </Typography>
      <Typography component="h3" variant="body2">Data and copyrights</Typography>
      <Typography className={classes.text} variant="body2">
        The Service Map has been developed using open data and open APIs. The service is developed publicly as
        an open source code project.
        The Service Map’s UI application and the source codes of the back-end application are available on GitHub,
        through which anyone can participate in the development of them.
      </Typography>
      <ul>
        <li>
          <Link target="_blank" href="https://github.com/City-of-Helsinki/servicemap-ui/">
            <Typography className={classes.link} variant="body2">Source code for the UI application</Typography>
          </Link>
        </li>
        <li>
          <Link target="_blank" href="https://github.com/City-of-Helsinki/smbackend/">
            <Typography className={classes.link} variant="body2">Source code for the back-end application</Typography>
          </Link>
        </li>
      </ul>
      <Typography className={classes.text} variant="body2">
        The data of the services and service units are open data and available through the REST-API, which is
        offered through the Service Map&apos;s back-end application. The data of the Service Map can be used freely,
        with the exception of photographs of sculptures and public art, which are protected by copyright and
        cannot be used for commercial purposes.
        The Service Map’s background maps “Service Map” and “High-contrast map” are compiled of
        OpenStreetMap service’s data, whose copyright belongs to the makers of OpenStreetMap.
        The file descriptions collection can be found on the hel.fi website. Check “Pääkaupunkiseudun toimipiste- ja
        palvelurekisteri” and “Osallisuuden ja palautteiden rekisteri”.
      </Typography>
      <Typography className={classes.text} variant="body2">
        The service has been developed at the ICT Management unit of the Helsinki City Executive Office.
      </Typography>
      <Typography component="h3" variant="body2">Cookies</Typography>
      <Typography className={classes.text} variant="body2">
        We use cookies on our website to improve the performance and content of the site. The website automatically collects the below data about visitors. This data is used to improve the user interface and user experience of the website and to monitor statistically the numbers of visitors. The data is not handed over to external parties.
        The website uses cookies to maintain the user session. Personal data identifying the user is not collected or recorded in the technical cookies.
        The user has the possibility to prevent the use of cookies by changing the settings of their browser. However, the use of the website without cookies may affect the functionality of the pages.
        The data collected for the visitor statistics of the service is anonymized so it cannot be connected to an individual person. This data includes:
      </Typography>
      <ul>
        <li>
          <Typography variant="body2">the IP address used to access the website</Typography>
        </li>
        <li>
          <Typography variant="body2">the time of accessing the service</Typography>
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
        {'Read more about Data protection of the Hel.fi Service: '}
        <Link target="_blank" href="https://www.hel.fi/helsinki/en/administration/information/information/safety-of-the-hel.fi/safety">
          Data protection of the Hel.fi Service | City of Helsinki
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
