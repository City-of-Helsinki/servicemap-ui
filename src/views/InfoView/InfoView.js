/* eslint-disable max-len */

import styled from '@emotion/styled';
import { ButtonBase, Link, NoSsr, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import config from '../../../config';
import { TitleBar } from '../../components';
import useMobileStatus from '../../utils/isMobile';

function InfoView({ locale }) {
  const isMobile = useMobileStatus();

  const a11yURLs = config.accessibilityStatementURL;
  const localeUrl =
    !a11yURLs[locale] || a11yURLs[locale] === 'undefined'
      ? null
      : a11yURLs[locale];

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
      data-sm="InfoPageTitle"
    />
  );
  const renderFinnishInfo = () => (
    <StyledTextContainer>
      {localeUrl ? (
        <>
          <Typography component="h3" variant="body2">
            Palvelukartan saavutettavuus
          </Typography>
          <StyledLinkButton role="link" onClick={() => handleClick()}>
            <Typography color="inherit" variant="body2">
              <FormattedMessage id="info.statement" />
            </Typography>
          </StyledLinkButton>
        </>
      ) : null}
      <Typography component="h3" variant="body2">
        <FormattedMessage id="app.title" />
      </Typography>
      <StyledText variant="body2">
        Palvelukartalta löytyy Espoon, Helsingin, Kauniaisten, Vantaan,
        Länsi-Uudenmaan sekä Vantaan ja Keravan hyvinvointialueiden julkiset
        toimipisteet ja niiden palvelut. Esimerkiksi koulut, päiväkodit sekä
        terveysasemat.
      </StyledText>

      <StyledText variant="body2">
        Palvelukartalta löytyy lisäksi muitakin palveluja, kuten HUSin
        röntgenit, Kirkkonummen liikuntapalvelut, HSY:n kierrätyspisteet,
        Aalto-yliopiston ja muita valtion palveluja. Lisäksi kartalta löytyy
        yksityisiä palveluita, jotka tulevat Kaupunki alustana palvelun kautta.
      </StyledText>
      {
        // Haku
      }
      <Typography component="h3" variant="body2">
        Haku
      </Typography>
      <Typography component="h4" variant="body2">
        Palvelukartalta voit hakea esimerkiksi:
      </Typography>
      <ul>
        <li>
          <Typography variant="body2">terveysasemia</Typography>
        </li>
        <li>
          <Typography variant="body2">kouluja</Typography>
        </li>
        <li>
          <Typography variant="body2">päiväkoteja</Typography>
        </li>
        <li>
          <Typography variant="body2">uimahalleja</Typography>
        </li>
        <li>
          <Typography variant="body2">pallokenttiä</Typography>
        </li>
        <li>
          <Typography variant="body2">kirjastoja</Typography>
        </li>
        <li>
          <Typography variant="body2">nuorisotaloja</Typography>
        </li>
        <li>
          <Typography variant="body2">
            iltapäivätoiminnan toimipisteitä
          </Typography>
        </li>
        <li>
          <Typography variant="body2">kierrätyspisteitä</Typography>
        </li>
        <li>
          <Typography variant="body2">röntgen pisteitä</Typography>
        </li>
        <li>
          <Typography variant="body2">pysäköintilippuautomaatteja</Typography>
        </li>
        <li>
          <Typography variant="body2">veistoksia</Typography>
        </li>
        <li>
          <Typography variant="body2">tapahtumia</Typography>
        </li>
        <li>
          <Typography variant="body2">osoitteita</Typography>
        </li>
        <li>
          <Typography variant="body2">väestönsuojia</Typography>
        </li>
      </ul>
      <Typography component="h4" variant="body2">
        Vaihtoehtoisia hakutapoja:
      </Typography>
      <ul>
        <li>
          <Typography variant="body2">
            Aloita kirjoittamaan hakukenttään hakemaasi sanaa, jolloin saat
            hakuehdotuksia, joista voit valita itsellesi sopivimman. Esimerkiksi
            ”päiväko”
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            Voit myös kirjoittaa hakemasi sanan kokonaisuudessaan ja painaa
            tämän jälkeen Hae –painiketta tai Enter näppäimistöltä. Esimerkiksi
            ”luontopolku”.
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            Jos hakutulos ei ollut hyvä, voit tarkentaa hakua
            Tarkenna–painikkeella.
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            Voit hakea myös usean sanan yhdistelmällä, esimerkiksi ”koulu
            espanja”.
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            Hae osoitteella: kirjoita osoite, minkä läheltä etsit palvelua. Hae
            osoitteella: kirjoita osoite, minkä läheltä etsit palvelua.
          </Typography>
        </li>
      </ul>
      <StyledText variant="body2">
        Hakukentässä on ruksi, jota painamalla voit tyhjentää haun.
        Palvelukartan hakukentän nuolipainikkeella voit palata edelliseen
        näkymään. Jos hakutulos on tyhjä, tarkista kirjoitusasu ja aluevalinnat.
      </StyledText>
      <Typography component="h4" variant="body2">
        Voit järjestää hakutulokset:
      </Typography>
      <ul>
        <li>
          <Typography variant="body2">aakkosjärjestys, A-Ö</Typography>
        </li>
        <li>
          <Typography variant="body2">
            käänteinen aakkosjärjestys Ö-A
          </Typography>
        </li>
        <li>
          <Typography variant="body2">esteettömin ensin</Typography>
        </li>
        <li>
          <Typography variant="body2">
            lähin ensin (anna palvelukartalle lupa paikantaa sinut)
          </Typography>
        </li>
      </ul>
      <StyledText variant="body2">
        Jos olet valinnut jonkin esteettömyysasetuksen (esim. käytän
        kuulolaitetta), hakutulos järjestyy esteettömin palvelu ensin
        (palvelussa on induktiosilmukka). Jos vaihdat esteettömyysasetusta,
        järjestys voi muuttua.
      </StyledText>
      <StyledText variant="body2">
        Jos annat luvan Palvelukartan paikantaa sinut, hakutulos järjestyy sinua
        lähin palvelu ensin. Osoitteen voi myös kirjoittaa käsin.
      </StyledText>
      <Typography component="h3" variant="body2">
        Osoitehaku
      </Typography>
      <StyledText variant="body2">
        Voit kirjoittaa hakukenttään kadun nimen, josta haluat etsiä palveluja.
        Haku antaa sinulle valittavaksi kadun nimen, valittuasi tulee
        osoite-ehdotukset. Helsingin kohdalla tulee myös alue-ehdotuksia (esim.
        oppilaaksiotto-alueet).
      </StyledText>
      <Typography component="h4" variant="body2">
        Kohdasta ”Alueesi palvelut” löydät mm. seuraavat palvelut:
      </Typography>
      <ul>
        <li>
          <Typography variant="body2">terveyskeskus</Typography>
        </li>
        <li>
          <Typography variant="body2">neuvola</Typography>
        </li>
        <li>
          <Typography variant="body2">
            suomen- ja ruotsinkielinen esiopetus
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            suomen- ja ruotsinkielinen ala-aste
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            suomen- ja ruotsinkielinen ylä-aste
          </Typography>
        </li>
        <li>
          <Typography variant="body2">pysäköintialueet</Typography>
        </li>
        <li>
          <Typography variant="body2">postinumeroalue</Typography>
        </li>
        <li>
          <Typography variant="body2">kaupunginosa</Typography>
        </li>
        <li>
          <Typography variant="body2">suojelupiiri</Typography>
        </li>
        <li>
          <Typography variant="body2">suojelulohko</Typography>
        </li>
        <li>
          <Typography variant="body2">suojelu alalohko</Typography>
        </li>
        <li>
          <Typography variant="body2">luonnonsuojelu-alueet</Typography>
        </li>
      </ul>
      <Typography component="h3" variant="body2">
        Palveluluettelo
      </Typography>
      <StyledText variant="body2">
        Palveluluettelo löytyy Palvelukartan ylä-osioista. Voit etsiä
        palvelupuun avulla yhtä tai useampaa palvelukokonaisuutta. Esim.
        lähiliikunta, liikuntapuistot ja päiväkoti. Muista painaa lopuksi ”Tee
        haku” painiketta.
      </StyledText>
      <Typography component="h3" variant="body2">
        Omat asetukset
      </Typography>
      <StyledText variant="body2">
        Sivun ylälaidasta sekä hakuruudun alapuolelta löydät omat asetukset.
        Täältä voit valita seuraavista itsellesi sopivat asetukset:
      </StyledText>
      <ul>
        <li>
          <Typography variant="body2">Aistirajoitteet:</Typography>
        </li>
        <ul>
          <li>
            <Typography variant="body2">käytän kuulolaitetta</Typography>
          </li>
          <li>
            <Typography variant="body2">olen näkövammainen</Typography>
          </li>
          <li>
            <Typography variant="body2">
              minun on vaikea erottaa värejä
            </Typography>
          </li>
        </ul>
        <li>
          <Typography variant="body2">Liikkumisrajoitteet:</Typography>
        </li>
        <ul>
          <li>
            <Typography variant="body2">käytän pyörätuolia</Typography>
          </li>
          <li>
            <Typography variant="body2">olen liikkumisesteinen</Typography>
          </li>
          <li>
            <Typography variant="body2">käytän rollaattoria</Typography>
          </li>
          <li>
            <Typography variant="body2">työnnän rattaita</Typography>
          </li>
        </ul>
        <li>
          <Typography variant="body2">Kaupunkiasetuksesi:</Typography>
        </li>
        <ul>
          <li>
            <Typography variant="body2">Helsinki</Typography>
          </li>
          <li>
            <Typography variant="body2">Espoo</Typography>
          </li>
          <li>
            <Typography variant="body2">Vantaa</Typography>
          </li>
          <li>
            <Typography variant="body2">Kauniainen</Typography>
          </li>
          <li>
            <Typography variant="body2">Kirkkonummi</Typography>
          </li>
        </ul>
      </ul>

      <StyledText variant="body2">
        Jos valitset jonkin esteettömyysasetuksen, hakemasi toimipistesivu
        näyttää sinulle esimerkiksi, miten pääset rollaattorilla toimipisteeseen
        ja mitkä ovat mahdolliset esteet siellä.
      </StyledText>
      <StyledText variant="body2">
        Kun valitset jonkin kaupungin, hakutulokset kohdistuvat ainoastaan tämän
        kaupungin tietoihin. Jos et ole valinnut yhtäkään kaupunkia, haku
        kohdistuu kaikkiin kaupunkeihin.
      </StyledText>

      <Typography component="h4" variant="body2">
        Karttatyökalut
      </Typography>
      <StyledText variant="body2">
        Karttatyökaluista löydät mahdollisuuksia hyödyntää Palvelukarttaa
        seuraavien työkalujen avulla:
      </StyledText>
      <ul>
        <li>
          <Typography variant="body2">Palvelukartan upotustyökalu</Typography>
        </li>
        <li>
          <Typography variant="body2">Lataa tiedot</Typography>
        </li>
        <li>
          <Typography variant="body2">Tulosta</Typography>
        </li>
        <li>
          <Typography variant="body2">Mittaa etäisyys hiirellä</Typography>
        </li>
      </ul>

      <Typography component="h4" variant="body2">
        Karttapohjan asetukset
      </Typography>
      <StyledText variant="body2">
        Löydät halutun karttapohjan karttatyökaluista. Voit valita
        karttapohjaksi seuraavat:
      </StyledText>
      <ul>
        <li>
          <Typography variant="body2">palvelukartta/oletuskartta</Typography>
        </li>
        <li>
          <Typography variant="body2">ilmakuva</Typography>
        </li>
        <li>
          <Typography variant="body2">opaskartta</Typography>
        </li>
        <li>
          <Typography variant="body2">korkeakontrastinen kartta</Typography>
        </li>
      </ul>

      <Typography component="h3" variant="body2">
        Palaute
      </Typography>
      <StyledText variant="body2">
        Kiitämme kaikesta palautteesta, jotta voimme kehittää Palvelukarttaa yhä
        paremmaksi. Voit lähettää Palvelukartasta yleistä palautetta kartan
        kehittäjille:&nbsp;
        <Link target="_blank" href="https://palvelukartta.hel.fi/fi/feedback">
          <Typography variant="string">
            https://palvelukartta.hel.fi/fi/feedback
          </Typography>
        </Link>
        &nbsp; (linkki, avautuu uudella välilehdellä).
      </StyledText>
      <StyledText variant="body2">
        Voit lähettää toimipisteeseen liittyvää palautetta suoraan palvelukartan
        toimipistesivulta. Hae haluamasi toimipiste, niin löydät
        palautelomakkeen toimipisteen tiedoista perustiedot –välilehdeltä.
      </StyledText>

      <Typography component="h3" variant="body2">
        Tiedot ja tekijänoikeudet
      </Typography>
      <StyledText variant="body2">
        Palvelukartta on rakennettu mahdollisimman täydellisesti avointa dataa
        ja avointa lähdekoodia käyttäen. Kartan lähdekoodi löytyy GitHubista ja
        sen kehittämiseen rohkaistaan.
      </StyledText>
      <ul>
        <li>
          <Link
            target="_blank"
            href="https://github.com/City-of-Helsinki/servicemap-ui/"
          >
            <StyledLink variant="body2">Sovelluksen lähdekoodi</StyledLink>
          </Link>
        </li>
        <li>
          <Link
            target="_blank"
            href="https://github.com/City-of-Helsinki/smbackend/"
          >
            <StyledLink variant="body2">
              Palvelinsovelluksen lähdekoodi
            </StyledLink>
          </Link>
        </li>
      </ul>
      <StyledText variant="body2">
        Karttatiedot haetaan avoimesta OpenStreetMapista ja niiden tekijänoikeus
        kuuluu OpenStreetMapin tekijöille. Reittitiedot tuodaan palveluumme
        HSL:n reittioppaasta. Palvelukartan tietoja voit käyttää vapaasti,
        paitsi veistosten ja julkisen taiteen pisteiden valokuvat, jotka ovat
        tekijänoikeussuojattuja, eikä niitä voi käyttää kaupallisiin
        tarkoituksiin. Rekisteriselosteet löydät kootusti hel.fi sivuilta:&nbsp;
        <Link
          target="_blank"
          href="https://www.hel.fi/fi/paatoksenteko-ja-hallinto/tietoa-helsingista/tietosuoja-ja-tiedonhallinta/tietosuoja/tietosuojaselosteet"
        >
          <Typography variant="string">
            https://www.hel.fi/fi/paatoksenteko-ja-hallinto/tietoa-helsingista/tietosuoja-ja-tiedonhallinta/tietosuoja/tietosuojaselosteet
          </Typography>
        </Link>
      </StyledText>
      <Typography component="h3" variant="body2">
        Evästeet
      </Typography>
      <StyledText variant="body2">
        Käytämme sivustollamme evästeitä parantaaksemme sivuston suorituskykyä.
        Sivustolla kerätään alla kuvatut tiedot kävijöistä. Näitä tietoja
        käytetään sivuston käyttöliittymän ja käyttökokemuksen parantamiseen
        sekä kävijämäärien tilastolliseen seurantaan. Tietoja ei luovuteta
        ulkopuolisille tahoille.
      </StyledText>
      <StyledText variant="body2">
        Sivustolla käytetään evästeitä (cookies) käyttäjäistunnon
        ylläpitämiseksi. Teknisiin evästeisiin ei kerätä eikä tallenneta
        käyttäjän yksilöiviä henkilötietoja.
      </StyledText>
      <StyledText variant="body2">
        Käyttäjällä on mahdollisuus estää evästeiden käyttö muuttamalla
        selaimensa asetuksia. Sivuston käyttäminen ilman evästeitä saattaa
        kuitenkin vaikuttaa sivujen toiminnallisuuteen.
      </StyledText>
      <StyledText variant="body2">
        Palvelun kävijätilastointia varten kerätyt tiedot anonymisoidaan, joten
        niitä ei voida liittää yksittäiseen henkilöön. Tällaisia tietoja ovat:
      </StyledText>
      <ul>
        <li>
          <Typography variant="body2">
            IP-osoite, josta verkkosivuille on siirrytty
          </Typography>
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
          <Typography variant="body2">
            alueellinen sijaintitieto, josta käyttäjää ei voi yksilöidä.
          </Typography>
        </li>
      </ul>
      <StyledText variant="body2">
        {'Lisää tietoa palvelun evästeistä: '}
        <Link
          target="_blank"
          href="https://www.hel.fi/helsinki/fi/kaupunki-ja-hallinto/tietoa-helsingista/tietoa-hel-fista/turvallisuus"
        >
          Verkkopalvelun tietosuoja ja evästeet | Helsingin kaupunki
        </Link>
      </StyledText>
    </StyledTextContainer>
  );

  const renderEnglishInfo = () => (
    <StyledTextContainer>
      {localeUrl ? (
        <>
          <Typography component="h3" variant="body2">
            Accessibility of the Service Map
          </Typography>
          <StyledLinkButton role="link" onClick={() => handleClick()}>
            <Typography color="inherit" variant="body2">
              <FormattedMessage id="info.statement" />
            </Typography>
          </StyledLinkButton>
        </>
      ) : null}
      <Typography component="h3" variant="body2">
        <FormattedMessage id="app.title" />
      </Typography>
      <StyledText variant="body2">
        The Service Map contains information on public service locations (for
        example, schools, daycare centres and health stations) in the cities of
        Espoo, Helsinki, Kauniainen and Vantaa, in addition to the wellbeing
        services counties of Western Uusimaa, Vantaa and Kerava.
      </StyledText>
      <StyledText variant="body2">
        The Service Map also provides information on other services, such as HUS
        hospital network x-ray units, sports and recreations services in the
        city of Kirkkonummi, HSY recycling points, Aalto University and other
        governmental services. The Service Map also shows several private
        services via the City Platform service.
      </StyledText>
      {
        // Haku
      }
      <Typography component="h3" variant="body2">
        Search
      </Typography>
      <Typography component="h4" variant="body2">
        Use the Service Map to locate, among others, the following
      </Typography>
      <ul>
        <li>
          <Typography variant="body2">health stations</Typography>
        </li>
        <li>
          <Typography variant="body2">schools</Typography>
        </li>
        <li>
          <Typography variant="body2">daycare centres</Typography>
        </li>
        <li>
          <Typography variant="body2">swimming halls</Typography>
        </li>
        <li>
          <Typography variant="body2">playing fields</Typography>
        </li>
        <li>
          <Typography variant="body2">libraries</Typography>
        </li>
        <li>
          <Typography variant="body2">youth centres</Typography>
        </li>
        <li>
          <Typography variant="body2">after-school activities</Typography>
        </li>
        <li>
          <Typography variant="body2">recycling points</Typography>
        </li>
        <li>
          <Typography variant="body2">hospital x-ray units</Typography>
        </li>
        <li>
          <Typography variant="body2">
            ticket machines for paying for parking
          </Typography>
        </li>
        <li>
          <Typography variant="body2">public artworks</Typography>
        </li>
        <li>
          <Typography variant="body2">events</Typography>
        </li>
        <li>
          <Typography variant="body2">street addresses</Typography>
        </li>
        <li>
          <Typography variant="body2">civil defence shelters</Typography>
        </li>
      </ul>

      <Typography component="h4" variant="body2">
        Service Map search options:
      </Typography>
      <ul>
        <li>
          <Typography variant="body2">
            Write a word (for example, daycare) in the search field and the
            service will provide you with several suggestions. Choose the
            suggestion that is most suitable and click Search.
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            Write the specific service (for example, nature trails) you are
            looking for in the search field and click Search or press Enter.
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            If the search doesn’t provide you with the exact information you are
            seeking, you can narrow down the search by clicking Refine
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            You can also narrow down the search by entering a more detailed
            phrase (for example, schools in English) in the search field.
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            Enter a street address or the name of a street near the services you
            are seeking.
          </Typography>
        </li>
      </ul>
      <StyledText variant="body2">
        Click the small x inside the search field to clear the search. Click the
        arrow within the search field to return to the previous search. If your
        search results come up empty, please check your search words for typos
        and your city setting.
      </StyledText>

      <Typography component="h4" variant="body2">
        Your search results can be arranged in:
      </Typography>
      <ul>
        <li>
          <Typography variant="body2">alphabetical order, A–Ö</Typography>
        </li>
        <li>
          <Typography variant="body2">
            reversed alphabetical order Ö–A
          </Typography>
        </li>
        <li>
          <Typography variant="body2">most accessible first</Typography>
        </li>
        <li>
          <Typography variant="body2">
            closest first (give permission to locate you)
          </Typography>
        </li>
      </ul>
      <StyledText variant="body2">
        If you have indicated a sensory processing issue (for example, ‘I use a
        hearing aid’), a search will automatically rank the most accessible
        services first (in this example, those services that provide an
        induction loop). If you switch off this kind of map setting, your search
        engine ranking order will may change.
      </StyledText>
      <StyledText variant="body2">
        If you give the Service Map permission to determine your location, a
        search request will automatically rand the services closest to you
        first. You can also enter your address in the Service Map manually.
      </StyledText>

      <Typography component="h3" variant="body2">
        Address search
      </Typography>
      <StyledText variant="body2">
        You can also write your address in the search field to find services
        near you. The search field will suggest street names to choose from, and
        after you have selected one, it will suggest specific addresses. The
        Service Map also generates certain area suggestions for Helsinki
        locations (for example, school catchment areas).
      </StyledText>
      <Typography component="h4" variant="body2">
        Find the following under the heading Services in your area:
      </Typography>
      <ul>
        <li>
          <Typography variant="body2">health station</Typography>
        </li>
        <li>
          <Typography variant="body2">
            maternity and child health clinics
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            Finnish and Swedish pre-primary education
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            Finnish and Swedish comprehensive education, grades 1-6
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            Finnish and Swedish comprehensive education, grades 7-9
          </Typography>
        </li>
        <li>
          <Typography variant="body2">parking areas</Typography>
        </li>
        <li>
          <Typography variant="body2">postal code areas</Typography>
        </li>
        <li>
          <Typography variant="body2">neighbourhoods</Typography>
        </li>
        <li>
          <Typography variant="body2">civil defence districts</Typography>
        </li>
        <li>
          <Typography variant="body2">civil defence sections</Typography>
        </li>
        <li>
          <Typography variant="body2">civil defence subsections</Typography>
        </li>
        <li>
          <Typography variant="body2">nature conservation areas</Typography>
        </li>
      </ul>

      <Typography component="h3" variant="body2">
        Services list
      </Typography>
      <StyledText variant="body2">
        The Services list contains each of the headings Service Map uses. You
        can use the list to find one or more service entities (for example,
        Outdoor sports parks or Daycare). Once you have selected the service
        headings you seek, remember to click Perform search.
      </StyledText>

      <Typography component="h3" variant="body2">
        My settings
      </Typography>
      <StyledText variant="body2">
        You can find the Settings options under the header the top of the main
        page and also under the search field. You can adjust the settings by
        clicking on any of the statements that apply to you:
      </StyledText>
      <ul>
        <li>
          <Typography variant="body2">Hearing and sight:</Typography>
        </li>
        <ul>
          <li>
            <Typography variant="body2">I use hearing aid</Typography>
          </li>
          <li>
            <Typography variant="body2">I am visually impaired</Typography>
          </li>
          <li>
            <Typography variant="body2">
              I have a colour vision deficiency{' '}
            </Typography>
          </li>
        </ul>
        <li>
          <Typography variant="body2">Mobility impairments:</Typography>
        </li>
        <ul>
          <li>
            <Typography variant="body2">I use a wheelchair</Typography>
          </li>
          <li>
            <Typography variant="body2">I have reduced mobility</Typography>
          </li>
          <li>
            <Typography variant="body2">I use a rollator</Typography>
          </li>
          <li>
            <Typography variant="body2">I push a stroller</Typography>
          </li>
        </ul>
        <li>
          <Typography variant="body2">City settings:</Typography>
        </li>
        <ul>
          <li>
            <Typography variant="body2">Helsinki</Typography>
          </li>
          <li>
            <Typography variant="body2">Espoo</Typography>
          </li>
          <li>
            <Typography variant="body2">Vantaa</Typography>
          </li>
          <li>
            <Typography variant="body2">Kauniainen</Typography>
          </li>
          <li>
            <Typography variant="body2">Kirkkonummi</Typography>
          </li>
        </ul>
      </ul>

      <StyledText variant="body2">
        If you select a mobility issue setting, your searches will show you
        first which locations allow easy access with, for example, a rollator,
        and what specific accessibility issues that location may have.
      </StyledText>
      <StyledText variant="body2">
        If you choose a specific city in the city settings, the service will
        only show you data associated with that city. If you do not select any
        city, the service will generate data about all the cities.
      </StyledText>

      <Typography component="h4" variant="body2">
        Map Tools
      </Typography>
      <StyledText variant="body2">
        Under the Map Tools heading, you will find a selection of helpful
        Service Map functionalities that can enhance your use of the service.
        These include:
      </StyledText>
      <ul>
        <li>
          <Typography variant="body2">Embedding tool</Typography>
        </li>
        <li>
          <Typography variant="body2">Download data</Typography>
        </li>
        <li>
          <Typography variant="body2">Print</Typography>
        </li>
        <li>
          <Typography variant="body2">Measure distance with a mouse</Typography>
        </li>
      </ul>

      <Typography component="h4" variant="body2">
        Background Map settings
      </Typography>
      <StyledText variant="body2">
        Several settings are also available for the background map. These
        include:
      </StyledText>
      <ul>
        <li>
          <Typography variant="body2">Service map default</Typography>
        </li>
        <li>
          <Typography variant="body2">Aerial view</Typography>
        </li>
        <li>
          <Typography variant="body2">Guide map</Typography>
        </li>
        <li>
          <Typography variant="body2">High-contrast map</Typography>
        </li>
      </ul>

      <Typography component="h3" variant="body2">
        Feedback
      </Typography>
      <StyledText variant="body2">
        {
          'We are grateful for all feedback, as it helps us to make the Service Map even better. You can send general feedback about the service to the service developers at '
        }
        <Link target="_blank" href="https://palvelukartta.hel.fi/en/feedback">
          <Typography variant="string">
            https://palvelukartta.hel.fi/en/feedback
          </Typography>
        </Link>
        {' (opens in new tab).'}
      </StyledText>
      <StyledText variant="body2">
        You can also send feedback directly to the individual service locations.
        After you have selected the service location in question, you will find
        a Give feedback button at the bottom of the Information column on the
        left side of the screen.
      </StyledText>

      <Typography component="h3" variant="body2">
        Data and copyrights
      </Typography>
      <StyledText variant="body2">
        The Service Map has been developed as extensively as possible by using
        open data and open APIs. The source code is available in GitHub, and
        everyone is encouraged to participate in its development.
      </StyledText>
      <ul>
        <li>
          <Link
            target="_blank"
            href="https://github.com/City-of-Helsinki/servicemap-ui/"
          >
            <StyledLink variant="body2">
              Source code for the application
            </StyledLink>
          </Link>
        </li>
        <li>
          <Link
            target="_blank"
            href="https://github.com/City-of-Helsinki/smbackend/"
          >
            <StyledLink variant="body2">
              Source code for the server application
            </StyledLink>
          </Link>
        </li>
      </ul>
      <StyledText variant="body2">
        The data provided by the service is compiled from OpenStreetMap, whose
        copyright belongs to its makers. Information on public transport
        journeys is compiled from Helsinki Region Transport’s Journey Planner
        service. Service Map data can be used freely, with the exception of
        photos of public artworks, which are protected by copyright and cannot
        be used for commercial purposes.
      </StyledText>
      <StyledText variant="body2">
        {'File descriptions can be found on the City of Helsinki website at: '}
        <Link
          target="_blank"
          href="https://www.hel.fi/fi/paatoksenteko-ja-hallinto/tietoa-helsingista/tietosuoja-ja-tiedonhallinta/tietosuoja/tietosuojaselosteet"
        >
          <Typography variant="string">
            https://www.hel.fi/fi/paatoksenteko-ja-hallinto/tietoa-helsingista/tietosuoja-ja-tiedonhallinta/tietosuoja/tietosuojaselosteet
          </Typography>
        </Link>
      </StyledText>

      <Typography component="h3" variant="body2">
        Cookies
      </Typography>
      <StyledText variant="body2">
        We use cookies on our website to improve the site’s performance. The
        data collected about visitors to the site is described below. It is used
        to improve the user interface and user experience, and to monitor the
        number of visitors to the site. This data is not handed over to external
        parties.
      </StyledText>
      <StyledText variant="body2">
        The site uses cookies to maintain the user session. No personal data
        that could identify the user is collected or recorded in the technical
        cookies.
      </StyledText>
      <StyledText variant="body2">
        Website users are free to reject the use of cookies by changing the
        browser settings. This may affect the functionality of the pages,
        however.
      </StyledText>
      <StyledText variant="body2">
        Data collected for visitor statistics is made anonymous, so it cannot be
        traced back to individuals. This data includes:
      </StyledText>

      <ul>
        <li>
          <Typography variant="body2">
            the IP address used to access the website
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            the time the service was accessed
          </Typography>
        </li>
        <li>
          <Typography variant="body2">the pages used in the service</Typography>
        </li>
        <li>
          <Typography variant="body2">the type of browser</Typography>
        </li>
        <li>
          <Typography variant="body2">
            regional location data, which cannot be used to identify the user
          </Typography>
        </li>
      </ul>
      <StyledText variant="body2">
        {'Read more about the service cookies on the '}
        <Link
          target="_blank"
          href="https://www.hel.fi/en/decision-making/information-on-helsinki/data-protection-and-information-management/data-protection"
        >
          City of Helsinki website pages on Data protection.
        </Link>
      </StyledText>
    </StyledTextContainer>
  );

  const renderSwedishInfo = () => (
    <StyledTextContainer>
      {localeUrl ? (
        <>
          <Typography component="h3" variant="body2">
            Servicekartans tillgänglighet
          </Typography>
          <StyledLinkButton role="link" onClick={() => handleClick()}>
            <Typography color="inherit" variant="body2">
              <FormattedMessage id="info.statement" />
            </Typography>
          </StyledLinkButton>
        </>
      ) : null}
      <Typography component="h3" variant="body2">
        <FormattedMessage id="app.title" />
      </Typography>
      <StyledText variant="body2">
        På Servicekartan finns de offentliga verksamhetsställena i Esbo,
        Helsingfors, Grankulla, Vanda, Västra Nylands välfärdsområde och Vanda
        och Kervo välfärdsområde samt deras tjänster. Till exempel skolor,
        daghem och hälsostationer finns utmärkta på servicekartan.
      </StyledText>
      <StyledText variant="body2">
        På servicekartan hittar du också andra tjänster, så som HUS röntgen,
        Kyrkslätts idrottstjänster, HRM:s återvinningsstationer,
        Aalto-universitetets tjänster samt andra statliga tjänster. På kartan
        finns även privata tjänster som nås via webbplatsen Stadsplattform.
      </StyledText>
      <Typography component="h3" variant="body2">
        Sökning
      </Typography>
      <Typography component="h4" variant="body2">
        På kartan kan du till exempel söka:
      </Typography>
      <ul>
        <li>
          <Typography variant="body2">hälsostationer</Typography>
        </li>
        <li>
          <Typography variant="body2">skolor</Typography>
        </li>
        <li>
          <Typography variant="body2">daghem</Typography>
        </li>
        <li>
          <Typography variant="body2">simhallar</Typography>
        </li>
        <li>
          <Typography variant="body2">bollplaner</Typography>
        </li>
        <li>
          <Typography variant="body2">bibliotek</Typography>
        </li>
        <li>
          <Typography variant="body2">ungdomsgårdar</Typography>
        </li>
        <li>
          <Typography variant="body2">eftermiddagsverksamhet</Typography>
        </li>
        <li>
          <Typography variant="body2">återvinningsstationer</Typography>
        </li>
        <li>
          <Typography variant="body2">röntgen</Typography>
        </li>
        <li>
          <Typography variant="body2">parkeringsbiljettautomater</Typography>
        </li>
        <li>
          <Typography variant="body2">skulpturer</Typography>
        </li>
        <li>
          <Typography variant="body2">evenemang</Typography>
        </li>
        <li>
          <Typography variant="body2">adresser</Typography>
        </li>
        <li>
          <Typography variant="body2">skyddsrum</Typography>
        </li>
      </ul>
      <Typography component="h4" variant="body2">
        Alternativa söksätt:
      </Typography>
      <ul>
        <li>
          <Typography variant="body2">
            Skriv in början av ordet du söker i sökfältet. Tjänsten föreslår
            alternativ av vilka du kan välja det lämpligaste. Till exempel
            ”daghe”
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            Du kan också skriva ordet du söker i sin helhet och därefter klicka
            på Sök eller trycka på Enter på ditt tangentbord. Ordet kan vara
            till exempel ”naturstig”.
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            Om du inte är nöjd med sökresultatet kan du begränsa sökningen genom
            att klicka på ”Precisera”.
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            Du kan också söka med en kombination av flera ord, till exempel
            ”skola spanska”.
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            Sök med adress: skriv in en adress i vars närhet du söker tjänster.
          </Typography>
        </li>
      </ul>

      <StyledText variant="body2">
        I sökfältet finns ett kryss med vilket du kan radera sökningen. Genom
        att klicka på pilen i servicekartans sökfält kan du återvända till den
        föregående vyn. Om sökningen inte ger lämpliga resultat, kontrollera
        stavningen och områdesvalen.
      </StyledText>

      <Typography component="h4" variant="body2">
        Du kan ordna sökresultaten:
      </Typography>
      <ul>
        <li>
          <Typography variant="body2">Alfabetisk ordning, A-Ö</Typography>
        </li>
        <li>
          <Typography variant="body2">
            Omvänd alfabetisk ordning, Ö-A
          </Typography>
        </li>
        <li>
          <Typography variant="body2">Tillgängligast först</Typography>
        </li>
        <li>
          <Typography variant="body2">
            Närmaste först (ge Servicekartan lov att lokalisera dig)
          </Typography>
        </li>
      </ul>
      <StyledText variant="body2">
        Om du har valt någon av tillgänglighetsinställningarna (t.ex. "jag
        använder hörapparat"), ordnas sökresultaten så att den tjänst som är
        mest tillgänglig kommer först (tjänsten har en induktionsslinga). Om du
        byter tillgänglighetsinställningen kan ordningen ändras.
      </StyledText>
      <StyledText variant="body2">
        Om du tillåter att servicekartan lokaliserar dig, ordnas sökresultaten
        så att den tjänst som ligger närmast dig kommer först. Du kan också
        skriva in adressen själv.
      </StyledText>

      <Typography component="h3" variant="body2">
        Adressökning
      </Typography>
      <StyledText variant="body2">
        I sökfältet kan du skriva namnet på den gata där du vill söka tjänster.
        Sökningen låter dig välja ett gatunamn. När du valt det dyker det upp
        förslag på närmare adresser. I fråga om Helsingfors kommer det också
        förslag på områden (t.ex. intagningsområden).
      </StyledText>
      <Typography component="h4" variant="body2">
        Under ”Tjänster i ditt område” hittar du bl.a. följande tjänster:
      </Typography>
      <ul>
        <li>
          <Typography variant="body2">hälsocentral</Typography>
        </li>
        <li>
          <Typography variant="body2">rådgivningsbyrå</Typography>
        </li>
        <li>
          <Typography variant="body2">
            finsk- och svenskspråkig förskoleundervisning
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            finsk- och svenskspråkigt lågstadium
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            finsk- och svenskspråkigt högstadium
          </Typography>
        </li>
        <li>
          <Typography variant="body2">parkeringsområden</Typography>
        </li>
        <li>
          <Typography variant="body2">postnummerområde</Typography>
        </li>
        <li>
          <Typography variant="body2">stadsdel</Typography>
        </li>
        <li>
          <Typography variant="body2">skyddsdistrikt</Typography>
        </li>
        <li>
          <Typography variant="body2">skyddsavsnitt</Typography>
        </li>
        <li>
          <Typography variant="body2">skyddsunderavsnitt</Typography>
        </li>
        <li>
          <Typography variant="body2">naturskyddsområden</Typography>
        </li>
      </ul>

      <Typography component="h3" variant="body2">
        Förteckning över tjänster
      </Typography>
      <StyledText variant="body2">
        Förteckningen över tjänster finns i övre delen av servicekartan. Med
        hjälp av ett katalogträd över tjänster kan du söka en eller flera
        tjänstehelheter. Det kan vara t.ex. närmotion, idrottsparker och daghem.
        Kom ihåg att till slut klicka på ”Gör sökning”.
      </StyledText>

      <Typography component="h3" variant="body2">
        Mina inställningar
      </Typography>
      <StyledText variant="body2">
        I övre kanten av sidan samt under sökfältet hittar du dina egna
        inställningar. Här kan du välja de inställningar som passar dig:
      </StyledText>
      <ul>
        <li>
          <Typography variant="body2">
            Sensorisk funktionsnedsättning:
          </Typography>
          <ul>
            <li>
              <Typography variant="body2">jag använder hörapparat</Typography>
            </li>
            <li>
              <Typography variant="body2">jag är synskadad</Typography>
            </li>
            <li>
              <Typography variant="body2">
                jag har svårt att urskilja färger
              </Typography>
            </li>
          </ul>
        </li>
        <li>
          <Typography variant="body2">Fysisk funktionsnedsättning:</Typography>
          <ul>
            <li>
              <Typography variant="body2">jag använder rullstol</Typography>
            </li>
            <li>
              <Typography variant="body2">jag har rörelsehinder</Typography>
            </li>
            <li>
              <Typography variant="body2">jag använder rollator</Typography>
            </li>
            <li>
              <Typography variant="body2">jag går med barnvagn</Typography>
            </li>
          </ul>
        </li>
        <li>
          <Typography variant="body2">Stadsinställningar:</Typography>
          <ul>
            <li>
              <Typography variant="body2">Helsingfors</Typography>
            </li>
            <li>
              <Typography variant="body2">Esbo</Typography>
            </li>
            <li>
              <Typography variant="body2">Vanda</Typography>
            </li>
            <li>
              <Typography variant="body2">Grankulla</Typography>
            </li>
            <li>
              <Typography variant="body2">Kyrkslätt</Typography>
            </li>
          </ul>
        </li>
      </ul>
      <StyledText variant="body2">
        Om du väljer en av tillgänglighetsinställningarna, visar sidan för det
        verksamhetsställe du sökt exempelvis hur du når stället med rollator och
        vilka eventuella hinder där finns.
      </StyledText>
      <StyledText variant="body2">
        När du väljer en av städerna gäller sökresultaten endast uppgifterna i
        den staden. Om du inte valt en enda stad, gäller sökningen alla städer
        ovan.
      </StyledText>

      <Typography component="h4" variant="body2">
        Kartverktyg
      </Typography>
      <StyledText variant="body2">
        Under denna rubrik hittar du möjligheter att utnyttja servicekartan med
        hjälp av följande verktyg:
      </StyledText>
      <ul>
        <li>
          <Typography variant="body2">
            Servicekartans inbäddningsverktyg
          </Typography>
        </li>
        <li>
          <Typography variant="body2">Exportera</Typography>
        </li>
        <li>
          <Typography variant="body2">Skriv ut</Typography>
        </li>
        <li>
          <Typography variant="body2">Mät avstånd med musen</Typography>
        </li>
      </ul>

      <Typography component="h4" variant="body2">
        Kartunderlagets inställningar
      </Typography>
      <StyledText variant="body2">
        Du hittar det kartunderlag du vill ha bland kartverktygen. Du kan välja
        följande som kartunderlag:
      </StyledText>
      <ul>
        <li>
          <Typography variant="body2">servicekartan/standardkarta</Typography>
        </li>
        <li>
          <Typography variant="body2">flygbild</Typography>
        </li>
        <li>
          <Typography variant="body2">guidekartan</Typography>
        </li>
        <li>
          <Typography variant="body2">karta med stora kontraster</Typography>
        </li>
      </ul>

      <Typography component="h3" variant="body2">
        Respons
      </Typography>
      <StyledText variant="body2">
        {
          'Vi tackar för all respons som hjälper oss att utveckla servicekartan och göra den ännu bättre. Du kan ge allmän respons till kartans utvecklare via servicekartan: '
        }
        <Link target="_blank" href="https://palvelukartta.hel.fi/en/feedback">
          <Typography variant="string">
            https://palvelukartta.hel.fi/en/feedback
          </Typography>
        </Link>
        {' (länken öppnas i en ny flik).'}
      </StyledText>
      <StyledText variant="body2">
        Du kan ge respons om ett verksamhetsställe direkt via dess sida på
        servicekartan. Leta fram verksamhetsstället. Feedbackblanketten hittar
        du under fliken grunduppgifter i uppgifterna om verksamhetsstället.
      </StyledText>

      <Typography component="h3" variant="body2">
        Uppgifter och upphovsrätt
      </Typography>
      <StyledText variant="body2">
        Servicekartan är uppbyggd genom att använda så mycket öppna data och
        öppen källkod som möjligt. Kartans källkod finns i GitHub och utveckling
        av koden uppmuntras:
      </StyledText>
      <ul>
        <li>
          <Link
            target="_blank"
            href="https://github.com/City-of-Helsinki/servicemap-ui/"
          >
            <StyledLink variant="body2">Applikationens källkod </StyledLink>
          </Link>
        </li>
        <li>
          <Link
            target="_blank"
            href="https://github.com/City-of-Helsinki/smbackend/"
          >
            <StyledLink variant="body2">
              Serverapplikationens källkod
            </StyledLink>
          </Link>
        </li>
      </ul>
      <StyledText variant="body2">
        Kartuppgifterna söks från öppna OpenStreetMap och uppgifternas
        upphovsrätt tillhör tillverkarna av OpenStreetMap. Ruttinformationen
        hämtas till vår tjänst från HSL: s reseplanerare. Du kan fritt använda
        servicekartans uppgifter, förutom fotografier på skulpturer och
        offentlig konst som skyddas av upphovsrätten och inte får användas för
        kommersiella syften.
      </StyledText>

      <StyledText variant="body2">
        {'Registerbeskrivningarna finns samlade på hel.fi sidan: '}
        <Link
          target="_blank"
          href="https://www.hel.fi/fi/paatoksenteko-ja-hallinto/tietoa-helsingista/tietosuoja-ja-tiedonhallinta/tietosuoja/tietosuojaselosteet"
        >
          <Typography variant="string">
            https://www.hel.fi/fi/paatoksenteko-ja-hallinto/tietoa-helsingista/tietosuoja-ja-tiedonhallinta/tietosuoja/tietosuojaselosteet
          </Typography>
        </Link>
      </StyledText>

      <Typography component="h3" variant="body2">
        Kakor
      </Typography>
      <StyledText variant="body2">
        Vi använder kakor på vår webbplats för att förbättra webbplatsens
        prestanda. Webbplatsen samlar in de besökaruppgifter som beskrivs nedan.
        Dessa uppgifter används för att förbättra användargränssnittet och
        användarupplevelsen samt för att statistiskt följa upp antalet besökare.
        Uppgifterna lämnas inte ut till utomstående.
      </StyledText>
      <StyledText variant="body2">
        Webbplatsen använder kakor (cookies) för att upprätthålla
        användarsessionen. Personuppgifter som kan identifiera användaren samlas
        eller lagras inte i de tekniska kakorna.
      </StyledText>
      <StyledText variant="body2">
        Användaren får hindra användning av kakor genom att ändra på sin
        webbläsares inställningar. Webbplatsens funktionalitet kan dock påverkas
        om den används utan kakor.
      </StyledText>
      <StyledText variant="body2">
        Uppgifterna som samlats in för besökarstatistiken över tjänsten
        anonymiseras och kan således inte kopplas till en enskild person. I
        sådana uppgifter ingår:
      </StyledText>
      <ul>
        <li>
          <Typography variant="body2">
            IP-adress varifrån användaren övergått till webbsida
          </Typography>
        </li>
        <li>
          <Typography variant="body2">tidpunkt</Typography>
        </li>
        <li>
          <Typography variant="body2">
            webbsidor som används i tjänsten
          </Typography>
        </li>
        <li>
          <Typography variant="body2">typ av webbläsare</Typography>
        </li>
        <li>
          <Typography variant="body2">
            lokala positionsdata som inte kan identifiera användaren
          </Typography>
        </li>
      </ul>
      <StyledText variant="body2">
        {'Mer information om kakor: '}
        <Link
          target="_blank"
          href="https://www.hel.fi/helsinki/sv/stad-och-forvaltning/information/information/sakerhet"
        >
          Webbtjänstens dataskydd | Helsingfors stad
        </Link>
      </StyledText>
    </StyledTextContainer>
  );

  const version = config.version || '';
  const commit = config.commit ? `${config.commit}` : '';
  const versionText = `Version: ${version} ${config.version && config.commit ? '-' : ''} ${commit}`;

  return (
    <div>
      <StyledPageContainer>
        {renderTitlebar()}
        {locale === 'fi' && renderFinnishInfo()}
        {locale === 'en' && renderEnglishInfo()}
        {locale === 'sv' && renderSwedishInfo()}
        <NoSsr>
          {config.version || config.commit ? (
            <StyledText align="left" aria-hidden="true">
              {versionText}
            </StyledText>
          ) : null}
        </NoSsr>
      </StyledPageContainer>
    </div>
  );
}

// Typechecking
InfoView.propTypes = {
  locale: PropTypes.string.isRequired,
};

export default InfoView;

const StyledPageContainer = styled.div(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

const StyledLinkButton = styled(ButtonBase)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingTop: 0,
  fontSize: '1rem',
  color: theme.palette.link.main,
  textDecoration: 'underline',
}));

const StyledLink = styled(Typography)(({ theme }) => ({
  color: theme.palette.link.main,
}));

const StyledText = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}));

const StyledTextContainer = styled.div(({ theme }) => ({
  whiteSpace: 'pre-line',
  textAlign: 'left',
  '& h3': {
    fontWeight: 'bold',
    fontSize: '1.063rem',
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  '& h4': {
    fontWeight: 'bold',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
  },
}));
