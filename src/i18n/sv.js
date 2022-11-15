/* eslint-disable quote-props */
const translations = {
  'app.title': 'Servicekarta',
  'app.description': 'Alla tjänster i huvudstadsregionen inom räckhåll.',
  'app.og.image.alt': 'Servicekarta logo',
  'app.errorpage.title': 'Felmeddelandesida',
  'app.navigation.language': 'Språk och kontrast',
  'app.navigation.home': 'Hem',
  'app.navigation.settings': 'Inställningar',

  'accept.settings.dialog.description': 'Du kan öppna uppgifterna antigen med tillgänglighetsinställningar eller utan begränsningar.',
  'accept.settings.dialog.title': 'Se verksamhetsstället med tillgänglighetsinställningar',
  'accept.settings.dialog.none': 'Inga särskilda tillgänglighetsinställningar',

  // Accessibility
  'accessibility': 'Tillgänglighet',
  'accessibility.info': 'Tillgänglighetsuppgifter', // TODO: Verify
  'accessibility.details': 'Noggrannare uppgifter',
  'accessibility.stamp': 'Tillgängligheten beaktad',
  'accessibility.shortcomings': 'Brister',
  'accessibility.shortcomings.plural': `{count, plural,
                                =0 {inga brister}
                                one {# brist}
                                other {# brister}
                              }`,

  // Address
  'address': 'Adress',
  'address.description': 'Se tjänsterna i närheten av adressen',
  'address.search': 'Adresssök',
  'address.search.cleared': 'Sökfältet har tömts',
  'address.search.location': 'Den valda positionen är {location}',
  'address.search.suggestion': 'Välj adress från sökresultaten',
  'address.show.area': 'Visa området på kartan',
  'address.error': 'Addressen kunde inte hittas',
  'address.nearby': 'Nära',
  'address.districts': 'Områden',
  'address.plural': 'Adresser',
  'address.services.header': 'Tjänstområde',
  'address.services.info': 'Kommunala tjänster vars verksamhetsområde omfattar positionen',
  'address.area.link': 'Bekanta dig med områdena på kartan.',
  'address.emergency_care.common': 'När den egna hälsostationen är stängd och på natten kl. 22-8 är jour för barn och unga under 16 år på <a>Nya barnsjukhuset</a> [<a1>hemsidor</a1>], och jour för vuxna på',
  'address.emergency_care.children_hospital.link': '/sv/unit/62976',
  'address.emergency_care.common.link': 'https://www.hus.fi/sv/patienten/sjukhus/nya-barnsjukhuset',
  'address.emergency_care.unit.26107': 'Malms sjukhuset',
  'address.emergency_care.unit.26104': 'Haartmanska sjukhuset',
  'address.emergency_care.link': 'https://www.hel.fi/sv/social-och-halsovardstjanster/halsovard/bradskande-vard-och-halsocentralsjour',
  'address.emergency_care.link.text': '[<a>joursidor</a>]',

  // Area
  // TODO: clean unused translations
  'area.city.selection.empty': 'Inga områden hittades i stadsvalet',
  'area.searchbar.infoText.address': 'Skriv din hemadress',
  'area.searchbar.infoText.optional': '(valfri)',
  'area.tab.publicServices': 'Områden för offentliga tjänster',
  'area.tab.geographical': 'Stadsdelar och postnummerområden',
  'area.tab.statisticalDistricts': 'Demografisk data',
  'area.services.local': 'Tjänster i ditt eget område',
  'area.services.nearby': 'Lista över verksamhetsställen i närområden',
  'area.services.nearby.rescue_area': 'Lista över tjänster i närområden', // TODO: correct name to replace "tjänster"
  'area.services.nearby.rescue_district': 'Lista över skyddsavsnitten i närområden',
  'area.services.nearby.rescue_sub_district': 'Lista över skyddsunderavsnitten i närområden',
  'area.services.all': 'Lista över verksamhetsställen',
  'area.services.all.rescue_area': 'Lista över skyddsdistrikten',
  'area.services.all.rescue_district': 'Lista över skyddsavsnitten',
  'area.services.all.rescue_sub_district': 'Lista över skyddsunderavsnitten',
  'area.info': 'Välj ett område, vars tjänster du vill ha information om. Genom att skriva din hemadress i sökfältet öppnas en karta och under fliken Tjänster i området visas de områden och distrikt som du hör till',
  'area.choose.district': 'Väl område',
  'area.list': 'Val av område',
  'area.localAddress.title': 'Uppgifter enligt din adress',
  'area.localAddress.neighborhood': 'Stadsdel: {area}',
  'area.localAddress.postCode': 'Postnummer: {area}',
  'area.geographicalServices.neighborhood': 'Tjänster i stadsdelen ({length})',
  'area.geographicalServices.postcode_area': 'Tjänster i postnummerområdet ({length})',
  'area.geographicalServices.major_district': 'Tjänster i stordistriktet ({length})',
  'area.geographicalServices.statistical_district': 'Välj först befolkningsdataområdet, varefter du kan bläddra bland regionens tjänster',
  'area.neighborhood.title': 'Välj stadsdel',
  'area.postcode_area.title': 'Välj postnummer',
  'area.major_district.title': 'Välj stordistrikt',
  'area.statisticalDistrict.info': 'Välj först befolkningsdataområdet, varefter du kan bläddra bland regionens tjänster',
  'area.statisticalDistrict.title': 'Välj befolkningsdataområde',
  'area.statisticalDistrict.section': 'Beskärning: {text}',
  'area.statisticalDistrict.noData': 'Kunde inte hämta data',
  'area.statisticalDistrict.label': '{count} personer, {percent}% av hela befolkningen i området',
  'area.statisticalDistrict.label.total': '{count} personer',
  'area.statisticalDistrict.label.people': '{count} personer',
  'area.statisticalDistrict.label.percent': '{percent}% av regionens totala befolkning',
  'area.statisticalDistrict.label.noResults': 'Befolkningsuppgifter inte tillgängliga',
  'area.statisticalDistrict.service.filter': 'Filtrering av demografiska tjänster',
  'area.statisticalDistrict.service.filter.button': 'Filtrera',
  'area.statisticalDistrict.service.filter.button.aria': 'Filtrera tjänster i befolkningsdataområden',
  'area.statisticalDistrict.service.filter.aria.notification': 'Befolkningsdatatjänster filtrerade med ordet {filterValue}',
  'area.noSelection': 'Väl område under fliken Val av område',
  'area.noUnits': 'Det finns inga verksamhetsställen i ditt valda område',
  'area.popupLink': 'Visa uppgifterna för området (ny flik)',
  'area.list.geographical': 'Geografisk',
  'area.list.protection': 'Befolkningsskydd',
  'area.list.health': 'Hälsa',
  'area.list.education': 'Utbildning',
  'area.list.natureConservation': 'Naturskydd',
  'area.list.parking': 'Parkering',
  'area.list.parking_area': 'Parkeringsområden',
  'area.list.parking_payzone': 'Avgiftszoner',
  'area.list.parking_payzone.plural': 'Avgiftszoner',
  'area.list.education.finnish': 'Finska skolområden',
  'area.list.education.swedish': 'Svenska skolområden',
  'area.list.preschool': 'Förskoleundervisning',
  'area.list.neighborhood': 'Stadsdel',
  'area.list.postcode': 'Postnummer',
  'area.list.postcode_area': 'Postnummerområde',
  'area.list.major_district': 'Stordistrikt',
  'area.list.rescue_area': 'Skyddsdistrikt',
  'area.list.rescue_district': 'Skyddsavsnitt',
  'area.list.rescue_sub_district': 'Skyddsunderavsnitt',
  'area.list.health_station_district': 'Hälsostationsområde',
  'area.list.maternity_clinic_district': 'Rådgivningsområde',
  'area.list.lower_comprehensive_school_district_fi': 'Finskt grundskoleområde, lågklasserna',
  'area.list.lower_comprehensive_school_district_sv': 'Svenskt grundskoleområde, lågklasserna',
  'area.list.upper_comprehensive_school_district_fi': 'Finskt grundskoleområde, högklasserna',
  'area.list.upper_comprehensive_school_district_sv': 'Svenskt grundskoleområde, högklasserna',
  'area.list.preschool_education_fi': 'Finskt småbarnspedagogikområde',
  'area.list.preschool_education_sv': 'Svenskt småbarnspedagogikområde',
  'area.list.nature_reserve': 'Naturskyddsområden',
  'area.list.resident_parking_zone': 'Invånarparkeringsområden',
  'area.list.neighborhood.plural': 'Stadsdelar',
  'area.list.postcode_area.plural': 'Postnummerområden',
  'area.list.major_district.plural': 'Stordistrikten',
  'area.list.rescue_area.plural': 'Skyddsdistrikten',
  'area.list.rescue_district.plural': 'Skyddsavsnitten',
  'area.list.rescue_sub_district.plural': 'Skyddsunderavsnitten',
  'area.list.health_station_district.plural': 'Hälsostationsområden',
  'area.list.maternity_clinic_district.plural': 'Rådgivningsområden',
  'area.list.lower_comprehensive_school_district_fi.plural': 'Finskt grundskoleområden, lågklasserna',
  'area.list.lower_comprehensive_school_district_sv.plural': 'Svenskt grundskoleområden, lågklasserna',
  'area.list.upper_comprehensive_school_district_fi.plural': 'Finskt grundskoleområden, högklasserna',
  'area.list.upper_comprehensive_school_district_sv.plural': 'Svenskt grundskoleområden, högklasserna',
  'area.list.preschool_education_fi.plural': 'Finskt småbarnspedagogikområden',
  'area.list.preschool_education_sv.plural': 'Svenskt småbarnspedagogikområden',
  'area.list.nature_reserve.plural': 'Naturskyddsområden',
  'area.list.resident_parking_zone.plural': 'Invånarparkeringsområden',
  'area.list.parkingSpaces': 'Parkeringsplatser',
  'area.list.parkingUnits': 'Parkeringshus',
  'area.list.statistic.byAge': 'Ålder',
  'area.list.statistic.forecast': 'Befolkningsprognos',
  'area.list.statistic.total': 'Alla invånare',
  'area.list.statistic.0-6': 'Ålder 0-6 år',
  'area.list.statistic.7-17': 'Ålder 7-17 år',
  'area.list.statistic.18-29': 'Ålder 18-29 år',
  'area.list.statistic.30-49': 'Ålder 30-49 år',
  'area.list.statistic.50-64': 'Ålder 50-64 år',
  'area.list.statistic.65+': 'Ålder över 65 år',

  // TODO: translate all
  'parkingArea.popup.residentName': 'Zon {letter}',
  'parkingArea.popup.payment1': 'Gratis parkering',
  'parkingArea.popup.payment2': 'Gratis parkering',
  'parkingArea.popup.payment3': 'Gratis parkering',
  'parkingArea.popup.payment4': 'Parkering mot avgift',
  'parkingArea.popup.payment5': 'Parkering mot avgift',
  'parkingArea.popup.payment6': 'Parkering mot avgift',
  'parkingArea.popup.duration1': 'Parkering tillåten högst: {duration}',
  'parkingArea.popup.duration2': 'Parkering tillåten högst: {duration}',
  'parkingArea.popup.duration3': '',
  'parkingArea.popup.duration4': 'Parkering tillåten högst: {duration}',
  'parkingArea.popup.duration5': 'Parkering tillåten högst: 4 h',
  'parkingArea.popup.duration6': '',
  'parkingArea.popup.validity1': 'Tidsbegränsning gäller för parkering: {validity}',
  'parkingArea.popup.validity2': 'Tidsbegränsning gäller för parkering: {validity}',
  'parkingArea.popup.validity3': 'Parkering förbjuden: {validity}',
  'parkingArea.popup.validity4': 'Parkeringen är avgiftsbelagd: {validity}',
  'parkingArea.popup.validity5': 'Parkeringen är avgiftsbelagd: {validity}',
  'parkingArea.popup.validity6': 'Parkeringen är avgiftsbelagd: {validity}',
  'parkingArea.popup.info': 'Uppgifterna är riktgivande. Kontrollera alltid uppgifterna på trafikmärket.',
  'parkingArea.popup.info1': 'Begränsningarna gäller inte personer med boende- eller företagsparkeringstillstånd om parkeringsplatsen har markerats som boendeparkeringsplats.',
  'parkingArea.popup.info2': 'Begränsningarna gäller inte personer med boende- eller företagsparkeringstillstånd om parkeringsplatsen har markerats som boendeparkeringsplats.',
  'parkingArea.popup.info3': 'Begränsningarna gäller inte personer med boende- eller företagsparkeringstillstånd om parkeringsplatsen har markerats som boendeparkeringsplats.',
  'parkingArea.popup.info4': 'Avgifterna och begränsningarna gäller inte personer med boende- eller företagsparkeringstillstånd om parkeringsplatsen har markerats som boendeparkeringsplats.',
  'parkingArea.popup.info5': 'Avgifterna och begränsningarna gäller inte personer med boende- eller företagsparkeringstillstånd om parkeringsplatsen har markerats som boendeparkeringsplats.',
  'parkingArea.popup.info6': 'Avgifterna och begränsningarna gäller inte personer med boende- eller företagsparkeringstillstånd om parkeringsplatsen har markerats som boendeparkeringsplats.',

  // Download dialog
  'download.cropping.title': 'Nuvarande filterinställningar',
  'download.cropText.unit': 'Enskilt verksamhetsställe:',
  'download.cropText.service': 'Verksamhetsställena med valda tjänster:',
  'download.cropText.search': 'Verksamhetsställena utifrån textsökning:',
  'download.cropText.none': 'Inga filtervärden har valts',
  'download.data.none': 'Plocka först fram verksamhetsställen på servicekartan med hjälp av bläddrings- eller sökfunktionen och kom sedan tillbaka till den här vyn för att spara verksamhetsställenas uppgifter.',
  'download.download': 'Ladda ner uppgifter (ny flik)',
  'download.format': 'Filformat:',
  'download.info': 'Spara uppgifterna om de verksamhetsställen som du har filtrerat i en fil som du kan ladda till exempel i applikationen Google Maps eller annars öppna för fortsatt behandling.',
  'download.title': 'Ladda ner verksamhetsställets uppgifter',
  'download.coordinate': 'Servicekartans koordinatsystem är: ETRS89 / GK25FIN (EPSG:3879)',

  // Event
  'event.description': 'Beskrivning',
  'event.time': 'Tidpunkt',
  'event.picture': 'Bild på evenemanget',
  'event.title': 'Evenemang',

  // Embed
  'embed.click_prompt_move': 'Klicka för att öppna Servicekartan',

  // Embedder
  'embedder.city.title': 'Staden',
  'embedder.city.aria.label': 'Välj stadsgränser för inbäddningen',
  'embedder.close': 'Stäng inbäddningsverktyget',
  'embedder.code.title': 'Kopiera HTML-koden',
  'embedder.height.title': 'Inbäddningens höjd',
  'embedder.height.aria.label': 'Välj inbäddningens höjd',
  'embedder.height.ratio.label': 'Relativ höjd. Inbäddningens höjd i förhållande till dess bredd har fastställts',
  'embedder.height.fixed.label': 'Abslout höjd. Inbäddningens höjd har fastställts i pixlar',
  'embedder.height.input.aria.fixed': 'Inbäddningens höjd i pixlar',
  'embedder.height.input.aria.ratio': 'Inbäddningens höjd som procent av bredden',
  'embedder.iframe.title': 'Servicekartans inbäddningsfönster',
  'embedder.language.title': 'Inbäddningens språk',
  'embedder.language.aria.label': 'Välj inbäddningens språk',
  'embedder.language.description.fi': 'Verksamhetsställenas information visas på finska. Bakgrundskartan är på finska.',
  'embedder.language.description.sv': 'Verksamhetsställenas information visas på svenska. Bakgrundskartan är på svenska.',
  'embedder.language.description.en': 'Verksamhetsställenas information visas på engelska. Bakgrundskartan är på finska.',
  'embedder.map.title': 'Bakgrundskarta',
  'embedder.map.aria.label': 'Välj bakgrundskarta',
  'embedder.options.title': 'Visa på kartan',
  'embedder.options.list.title': 'Toimipistelista', // TODO: translate
  'embedder.options.label.list.none': 'Piilota toimipistelista', // TODO: translate
  'embedder.options.label.list.side': 'Näytä toimipisteet listana (kartan vieressä)', // TODO: translate
  'embedder.options.label.list.bottom': 'Näytä toimipisteet listana (kartan alla)', // TODO: translate
  'embedder.options.label.units': 'Visa verksamhetsställen',
  'embedder.options.label.transit': 'Visa kollektivtrafikens hållplatser (Zooma in kartan för att se hållplatserna)',
  'embedder.options.label.bbox': 'Begränsa den inbäddade kartan till området i förhandsgranskningsfönstret',
  'embedder.preview.title': 'Map preview',
  'embedder.service.title': 'Tjänster',
  'embedder.service.aria.label': 'Välj tjänsterna som visas',
  'embedder.service.none': 'Kartan visas utan verksamhetsställen',
  'embedder.service.common': 'På kartan visas de vanligaste verksamhetsställena i stadsbons vardag: skolor, daghem och hälsostationer.',
  'embedder.service.all': 'Alla verksamhetsställen visas på kartan. För omfattande områdesgränser gör inbäddningen långsammare och otydligare.',
  'embedder.title': 'Inbäddningsverktyg',
  'embedder.title.info': 'Palvelukartan upotustyökalulla voit upottaa Palvelukartan yksittäisiä näkymiä osaksi mitä tahansa verkkosivua.', // TODO: translate
  'embedder.info.title': 'Ohjeet upotustyökalun käyttöön', // TODO: translate
  'embedder.info.description': 'Valitse alla olevasta valikoimasta karttanäkymään haluamasi toiminnallisuudet. Kopioi kartanalta URL-linkki tai html-koodi käyttöösi.\n\n Tarkemmat ohjeet upotustyökalun käyttöön eri tilanteissa löydät', // TODO: translate
  'embedder.info.link': 'täältä (uusi välilehti)', // TODO: translate
  'embedder.url.title': 'Kopiera URL',
  'embedder.width.title': 'Inbäddningens bredd',
  'embedder.width.aria.label': 'Välj inbäddningens bredd',
  'embedder.width.auto.label': 'Automatisk bredd. Inbäddningen fyller bredden av elementet som den har placerats i. I den här förhandsgranskningen har inbäddningen placeats i ett element med standardbredd markerat med en streckad linje.',
  'embedder.width.custom.label': 'Bredden har fastställts. Inbäddningens bredd har fastställs i pixlar.',
  'embedder.width.input.aria.auto': 'Inbäddningens bredd, procent',
  'embedder.width.input.aria.custom': 'Inbäddningens bredd, pixlar',

  // Feedback
  'feedback.back': 'Gå tillbaka',
  'feedback.title': 'Ge respons om den här nättjänsten',
  'feedback.title.unit': 'Ge respons om verksamhetsstället {unit}',
  'feedback.email': 'Email',
  'feedback.email.info': 'Om du vill att vi svarar på din respons, vänligen uppge din e-postadress.',
  'feedback.feedback': 'Din respons (obligatorisk)',
  'feedback.feedback.info': 'Berätta så detaljerat som möjligt hurdan respons du vill ge.',
  'feedback.permission': 'Min respons får publiceras (efter kontroll). E-postadressen publiceras inte.',
  'feedback.additionalInfo': 'Din respons skickas vidare till Helsingfors stads responssystem.',
  'feedback.additionalInfo.link': 'Information och anvisningar om att ge respons (länken öppnas i en ny flik).',
  'feedback.send': 'Skicka respons',
  'feedback.sending': 'Sänder...',
  'feedback.send.error': 'Skicka respons. Obligatoriska fält måste fyllas i',
  'feedback.error.required': 'Obligatoriskt fält',
  'feedback.error.email.invalid': 'E-postadressen ska skrivas i rätt form.',
  'feedback.srError.email.invalid': 'E-postadressen är felaktig. Korrigera adressen.',
  'feedback.srError.feedback.required': 'Responsen fattas. Skriv din respons.',
  'feedback.modal.confirm': 'OK',
  'feedback.modal.leave': 'Är du säker på att du vill lämna den här sidan?',
  'feedback.modal.success': 'Tack för din respons!',
  'feedback.modal.error': 'Det gick inte att skicka.  Försök på nytt senare',

  // Sorting
  'sorting.label': 'Ordna sökresultaten',
  'sorting.accessibility.desc': 'Tillgängligaste först',
  'sorting.alphabetical.asc': 'Omvänd alfabetisk ordning',
  'sorting.alphabetical.desc': 'Alfabetisk ordning',
  'sorting.distance.asc': 'Närmast först',
  'sorting.match.desc': 'Bästa träffarna först',

  // General
  'general.frontPage': 'Framsidan',
  'general.contrast': 'Kontrast',
  'general.contrast.ariaLabel.on': 'Aktivera högkontrastläge',
  'general.contrast.ariaLabel.off': 'Gå tillbaka till standardkontrastläge',
  'general.menu': 'Meny',
  'general.back': 'Tillbaka',
  'general.back.address': 'Gå tillbaka till adressidan',
  'general.back.area': 'Gå tillbaka till områdessidan',
  'general.back.home': 'Gå tillbaka till startsidan',
  'general.back.goToHome': 'Gå till startsidan',
  'general.back.search': 'Gå tillbaka till söksidan',
  'general.back.service': 'Gå tillbaka till tjänstesidan',
  'general.back.unit': 'Gå tillbaka till sida för verksamhetsställen',
  'general.back.event': 'Gå tillbaka till evenemangsidan',
  'general.back.feedback': 'Gå tillbaka',
  'general.backTo': 'Gå tillbaka',
  'general.back.info': 'Gå tillbaka',
  'general.backToHome': 'Stäng sökningen och gå tillbaka till början',
  'general.backToStart': 'Gå tillbaka till början av sidan',
  'general.back.serviceTree': 'Gå tillbaka till servicekatalogen',
  'general.cancel': 'Ångra',
  'general.close': 'Stäng',
  'general.distance.meters': 'Meters avstånd',
  'general.distance.kilometers': 'Kilometers avstånd',
  'general.yes': 'Ja',
  'general.no': 'Nej',
  'general.openSettings': 'Öppna inställningarna',
  'general.hideSettings': 'Piilota asetukset', // TODO: translate
  'general.closeSettings': 'Stäng inställningarna',
  'general.fetching': 'Laddar data...',
  'general.home': 'Hem',
  'general.home.logo.ariaLabel': 'Servicekarta - Gå till startsidan',
  'general.noData': 'Data finns inte',
  'general.news.alert.title': 'Meddelandefönster',
  'general.news.alert.close.aria': 'Stäng meddelandefönstret',
  'general.news.info.title': 'Servicekartans nyheter',
  'general.language.fi': 'Suomeksi',
  'general.language.sv': 'På svenska',
  'general.language.en': 'In English',
  'general.loading': 'Laddar',
  'general.loading.done': 'Laddning färdig',
  'general.showOnMap': 'Visa på kartan',
  'general.open': 'Open', // TODO: Translate
  'general.page.close': 'Close page', // TODO: Translate
  'general.pageTitles.home': 'Hemsida',
  'general.pageTitles.search': 'Sökresultatsida',
  'general.pageTitles.unit': 'Vy med verksamhetsställen',
  'general.pageTitles.unit.services': 'Verksamhetsställets tjänster',
  'general.pageTitles.unit.events': 'Verksamhetsställets evenemang',
  'general.pageTitles.unit.reservations': 'Verksamhetsställets platser som kan reserveras',
  'general.pageTitles.service': 'Tjänstesida',
  'general.pageTitles.serviceTree': 'Servicekatalogsida',
  'general.pageTitles.serviceTree.title': 'Servicekatalog',
  'general.pageTitles.event': 'Evenemangssida',
  'general.pageTitles.address': 'Adressida',
  'general.pageTitles.list.events': 'Förteckning över evenemang ',
  'general.pageTitles.list.reservations': 'Förteckning över reserveringar ',
  'general.pageTitles.info': 'Infosida',
  'general.pageTitles.feedback': 'Responssida',
  'general.pageTitles.area': 'Områdessida',
  'general.pageLink.area': 'Alueesi palvelut', // TODO: translate


  // General - Pagination
  'general.pagination.previous': 'Föregående sida',
  'general.pagination.next': 'Följande sida',
  'general.pagination.openPage': 'Öppna sida {count}',
  'general.pagination.currentlyOpenedPage': 'Sida {count} öppnad',
  'general.pagination.pageCount': 'sida {current} av {max}',

  'general.previousSearch': 'Föregående sökningar',
  'general.return.viewTitle': 'Gå till början av huvudinnehållet',
  'general.skipToContent': 'Gå till huvudinnehållet',
  'general.new.tab': 'Öppnas i en ny flik',
  'general.save': 'Spara',
  'general.save.changes': 'Spara inställningar',
  'general.save.changes.done': 'Ändringarna har sparats!',
  'general.save.confirmation': 'Vill du spara ändringarna?',
  'general.search': 'Sök',
  'general.share.link': 'Dela länken',
  'general.time.short': 'kl.',
  'general.tools': 'Karttatyökalut', // TODO: translate
  // Readspeaker
  'general.readspeaker.buttonText': 'Lyssna', // TODO: verify
  'general.readspeaker.title': 'Lyssna med ReadSpeaker webReader', // TODO: verify

  // Home
  'home.buttons.settings': 'Spara dina egna stads- och tillgänglighetsinställningar',
  'home.buttons.services': 'Läs mer om tjänsterna i servicekatalogen',
  'home.buttons.closeByServices': 'Visa närtjänster',
  'home.buttons.instructions': 'Tips för användning av servicekartan',
  'home.buttons.area': 'Se hälsovårds-, rådgivnings-, elevupptagnings-, förskole-, befolkningsskydds- och naturskyddsområdena samt stadsdelarna',
  'home.example.search': 'Sök med sökord',
  'home.message': 'Hälsningar av servicekartans utvecklare',
  'home.send.feedback': 'Skicka respons',
  'home.old.link': 'Gamla Servicekartan',

  // Location
  'location.notFound': 'Positionen hittades inte',
  'location.notAllowed': 'Positionen tilläts inte',
  'location.center': 'Centrera på användarens position',

  // Loading
  'loading.events': 'Söker evenemang {count} / {max}',
  'loading.events.srInfo': 'Söker {count} evenemange(n)',
  'search.loading.units': 'Söker verksamhetsställen {count} / {max}',
  'search.loading.units.srInfo': 'Söker {count} verksamhetsställe(n)',
  'search.loading.units.simple': 'Söker verksamhetsställen',

  'link.settings.dialog.title': 'Dela länken till verksamhetsstället',
  'link.settings.dialog.tooltip': 'Kopierades till klippbordet',
  'link.settings.dialog.radio.label': 'Länkens innehåll',
  'link.settings.dialog.tooltip.aria': 'Kopiera sidans länk till klippbordet',
  'link.settings.dialog.tooltip.aria.a11y': 'Kopiera sidans länk med tillgänglighetsinställningar till klippbordet',
  'link.settings.dialog.subtitle': 'Dela länken med tillgänglighetsinställningar',
  'link.settings.dialog.description': 'Tillgänglighetsinställningarna påverkar det visade verksamhetsställets tillgänglighetsuppgifter och kartans utseende.',
  'link.settings.dialog.buttons.action': 'Kopiera till klippbordet',

  // Map
  'map': 'Karta',
  'map.open': 'Öppna Karta',
  'map.close': 'Stäng Karta',
  'map.ariaLabel': 'Kartvy. Kartans uppgifter kan i nuläget granskas endast visuellt.',
  'map.attribution.osm': '&copy; <a href="http://osm.org/copyright">Upphovsmännen bakom OpenStreetMaps</a>',
  'map.attribution.helsinki': '&copy; Helsingfors, Esbo, Vanda och Grankulla städer',
  'map.transit.endStation': 'Ändhållplats',
  'map.address.coordinate': 'Tee linkki GPS-koordinaatteihin', // TODO: translate
  'map.address.searching': 'Söker adress...',
  'map.address.notFound': 'Adressen hittades ej',
  'map.address.info': 'Adressens uppgifter',
  'map.unit.cluster.popup.info': '{count} verksamhetsställen', // TODO: Verify
  'map.button.sidebar.hide': 'Minska sidopanelen',
  'map.button.sidebar.show': 'Utvidga sidopanelen',
  'map.button.expand': 'Laajenna', // TODO: translate
  'map.button.expand.aria': 'Avaa kartta', // TODO: translate

  // Print
  'print.alert': 'Använd utskriftsalternativet i verktygsmenyn',
  'print.button.close': 'Stäng vyn',
  'print.button.print': 'Skriv ut vyn',
  'print.table.header.number': 'Nummer på kartan',

  // Units
  'unit': 'Verksamhetsställe',
  'unit.showInformation': 'Visa uppgifterna för verksamhetsstället',
  'unit.accessibility.hearingMaps': 'Täckningskartor',
  'unit.accessibility.noInfo': 'Inga tillgänglighetsuppgifter',
  'unit.accessibility.noShortcomings': 'Inga igenkända brister',
  'unit.accessibility.ok': 'Tillänglig',
  'unit.accessibility.problems': `{count, plural,
                                    =0 {Tillänglig}
                                    one {# tillgänglighetsbrist}
                                    other {# tillgänglighetsbrister}
                                  }`,
  'unit.accessibility.unitNoInfo': 'Tillgänglighetsuppgifter saknas.',
  'unit.basicInfo': 'Grunduppgifter',
  'unit.data_source': 'Källa: {data_source}',
  'unit.details.notFound': 'Verksamhetsställets uppgifter finns inte att tillgå.',
  'unit.plural': 'Verksamhetsställen',
  'unit.distance': 'Avstånd',

  'unit.contact.info': 'Kontaktuppgifter',
  'unit.links': 'På webben',
  'unit.eServices': 'E-tjänster',
  'unit.reservations': 'Objekt som kan reserveras',
  'unit.events': 'Evenemang',
  'unit.events.description': 'Här hittar du information om evenemang som erbjuds av verksamhetsstället',
  'unit.events.count': `{count, plural,
    =0 {}
    one {# evenemang}
    other {# evenemang}
  }`,
  'unit.events.more': 'Visa fler evenemang ({count})',
  'unit.homepage': 'Hemsida',
  'unit.homepage.missing': 'Ingen hemsida har meddelats',
  'unit.picture': 'Bild av verksamhetsstället',
  'unit.description': 'Information om verksamhetsstället',
  'unit.price': 'Priser',
  'unit.address': 'Adress',
  'unit.address.missing': 'Ingen adress har meddelats',
  'unit.entrances.main': 'Huvudingång',
  'unit.entrances.secondary': 'Tilläggsingång',
  'unit.entrances.show': 'Se tilläggsingångar',
  'unit.entrances.accessibility': 'Se tillgänglighetsuppgifter',
  'unit.phone': 'Telefonnummer',
  'unit.phone.missing': 'Telefonnummer har inte meddelats',
  'unit.phone.charge': 'Samtalspriser',
  'unit.email': 'E-postadress',
  'unit.email.missing': 'E-postadress har inte meddelats',
  'unit.opening.hours': 'Öppettider',
  'unit.opening.hours.missing': 'Öppettider har inte meddelats',
  'unit.opening.hours.info': 'Mer om öppettiderna',
  'unit.contact': 'Kontaktperson',
  'unit.school.year': 'Läsåret',
  'unit.opens.new.tab': '(ny flik)',
  'unit.reservations.description': 'Här hittar du information om lokaler och redskap som kan bokas vid verksamhetsstället.',
  'unit.reservations.count': `{count, plural,
    =0 {}
    one {# objekt som kan reserveras}
    other {# objekt som kan reserveras}
  }`,
  'unit.reservations.more': 'Visa fler objekt som kan reserveras ({count})',
  'unit.call.number': '(ring)',
  'unit.list.services': 'Tjänster',
  'unit.list.events': 'Evenemang',
  'unit.list.reservations': 'Objekt som kan reserveras',
  'unit.services': 'Verksamhetsställets tjänster',
  'unit.services.description': 'Utöver servicebeskrivningen hittar du information om olika kanaler för uträttning av ärenden som erbjuds av kommunen.',
  'unit.services.more': 'Visa fler tjänster ({count})',
  'unit.services.count': `{count, plural,
    =0 {}
    one {# tjänst}
    other {# tjänster}
  }`,
  'unit.subgroup.title': 'Se gruppspecifika kontaktuppgifter',
  'unit.educationServices': 'Verksamhetsställets tjänster per läsår',
  'unit.educationServices.description': 'Läsåret {period}',
  'unit.educationServices.more': 'Visa fler tjänster ({count})',
  'unit.route': 'Se vägen till det här stället',
  'unit.route.extra.hslRouteGuide': '(Ny flik. HRT-reseplaneraren är inte en tillgänglig tjänst)',
  'unit.route.extra.routeGuide': '(Ny flik. Matka.fi-reseplaneraren är inte en tillgänglig tjänst)',
  'unit.socialMedia.title': 'Verksamhetsstället på sociala medier',
  'unit.outdoorLink': 'Kolla skicket på en motionsplats i tjänsten ulkoliikunta.fi',
  'unit.seo.description': 'Se läget på kartan',
  'unit.seo.description.accessibility': 'Se tillgänglighetsuppgifterna och läget på kartan',

  // Search
  'search': 'Sök',
  'search.arrowLabel': 'Precisera',
  'search.cancelText': 'Töm sökfältet',
  'search.removeSuggestion': 'Remove', // TODO: translate
  'search.notFoundWith': 'Inga träffar för sökningen "{query}".',
  'search.placeholder': 'Sök tjänst eller verksamhetsställe',
  'search.info': `{count, plural,
                  =0 {Inga verksamhetsställen hittades}
                  one {# verksamhetsställe hittades}
                  other {# verksamhetsställen hittades}
                }`,
  'search.resultList': `{count, plural,
                  =0 {inga träffar}
                  one {# träff}
                  other {# träffar}
                }`,
  'search.results': `{count, plural,
                  =0 {Inga sökresultat hittades med sökningen}
                  one {# sökresultat hittades}
                  other {# sökresultat hittades}
                }`,
  'search.results.short': `{count, plural,
                  =0 {inga träffar}
                  one {# träff}
                  other {# träffar}
                }`,
  'search.results.units': `{count, plural,
                  =0 {inga verksamhetsställen hittades}
                  one {# verksamhetsställe hittades}
                  other {# verksamhetsställen hittades}
                }`,
  'search.results.services': `{count, plural,
                  =0 {inga tjänster hittades}
                  one {# tjänst hittades}
                  other {# tjänster hittades}
                }`,
  'search.resultInfo': 'Sökdata',
  'search.searchField': 'Sökfält',
  'search.results.title': 'Sökresultat',
  'search.input.placeholder': 'Sök verksamhetsställen',
  'search.notFound': 'Inga sökresultat hittades med sökningen',
  'search.started': 'Sökningen har börjat',
  'search.infoText': '{count} sökresultat',
  'search.searchbar.headerText': 'Alla tjänster i huvudstadsregionen inom räckhåll.',
  'search.searchbar.infoText': 'Sök tjänster, verksamhetsställen eller adresser',
  'search.skipLink': 'Hoppa till sökresultaten',
  'search.suggestions.suggest': 'Menade du..?',
  'search.suggestions.expand': 'Sökförslag',
  'search.suggestions.loading': 'Laddar förslag',
  'search.suggestions.error': 'Inga förslag',
  'search.suggestions.areas': 'Näytä alueet', // TODO: translate
  'search.suggestions.addresses': 'Hae osoitteella', // TODO: translate
  'search.suggestions.suggestions': '{count} sökförslag',
  // 'search.suggestions.expandSuggestions': '{count} preciseringsförslag',
  'search.suggestions.results': '{count} resultat',
  'search.suggestions.hideButton': 'Göm listan med förslag',
  'search.suggestions.history': '{count} objekt i sökhistorien',
  'search.suggestions.noHistory': 'Inga tidigare sökningar',
  'search.tryAgain': 'Försök att söka på nytt',
  'search.tryAgainBody.spelling': 'kontrollera stavningen',
  'search.tryAgainBody.city': 'kontrollera stadsvalen',
  'search.tryAgainBody.service': 'skriv tjänstens namn',
  'search.tryAgainBody.address': 'skriv adressen i närheten av vilken du söker en tjänst',
  'search.tryAgainBody.keyword': 'skriv nyckelord, t.ex. naturstig, svenskt daghem',
  'search.expand': 'Precisera sökningen',
  'search.closeExpand': 'Gå tillbaka till sökningen',

  // Service
  'service': 'Tjänst',
  'service.plural': 'Tjänster',
  'service.nearby': 'Närtjänster',
  'service.units.empty': 'Tjänsten har inga verksamhetsställen',
  'service.tab': 'Tjänster',
  'service.description': 'Se tjänsternas lägen och kontaktuppgifter',

  // Service tree
  'services': 'Förteckning över tjänster',
  'services.selections': `{count, plural,
        one {Du har gjort (#) val}
        other {Du har gjort (#) val}
      }`,
  'services.selections.delete': 'Ta bort val:',
  'services.selections.delete.all': 'Ta bort alla val',
  'services.selections.delete.sr': 'Ta bort val: {service}',
  'services.search': 'Gör sökning',
  'services.search.sr': 'Sök med de valda tjänsterna',
  'services.search.sr.selected': 'Sök med tjänsterna: {services}',
  'services.category.select': 'Alla',
  'services.category.open': 'Öppna kategori',
  'services.info': 'Välj minst en tjänst från listan över tjänster nedan som du kan utföra sökningen.',
  'services.tree.level': 'Nivå',

  // Settings
  'settings': 'Inställningar',
  'settings.open': 'Avaa asetusvalinnat', // TODO: translate
  'settings.close': 'Sulje asetusvalinnat', // TODO: translate
  'settings.change': 'Redigera dina inställningar',
  'settings.drawer.aria.title': 'Nuvarande inställningar',
  'settings.citySettings': 'Stad',
  'settings.citySettings.long': 'Stadsinställningar',
  'settings.mapSettings': 'Kartunderlag',
  'settings.mapSettings.long': 'Kartinställningar',
  'settings.accessibilitySettings': 'Tillgänglighetsinställningar',
  'settings.accessibilitySettings.long': 'Tillgänglighetsinställningar',
  'settings.mobile.long': 'Inställningar',
  'settings.search.long': 'Inställningar',
  'settings.area.long': 'Stadsinställningar',
  'settings.amount': `{count, plural,
    one {# val} 
    other {# val}
  }`,
  'settings.accessibility': 'Tillgänglighetsuppgifter som gäller mig',
  'settings.accessibility.none': 'Inga filtreringar',
  'settings.sense.title': 'Hörsel och syn',
  'settings.sense.hearingAid': 'Jag använder hörapparat',
  'settings.sense.visuallyImpaired': 'Jag är synskadad',
  'settings.sense.colorblind': 'Jag har svårt att urskilja förger',
  'settings.info.heading': 'Inställningsuppgifter',
  'settings.info.title': 'Dina valda inställningar påverkar sökresultatet',
  'settings.info.title.city': 'Stadsinställningarna påverkar områdesinformationen',
  'settings.info.title.noSettings': 'Ändra sök- eller tillgänglighetsinställningar',
  'settings.info.title.noSettings.city': 'Ändra stadsinställningarna för att begränsa antalet områden',
  'settings.mobility.title': 'Rörelsehinder',
  'settings.mobility.none': 'Inga rörelsehinder',
  'settings.mobility.wheelchair': 'Jag använder rullstol',
  'settings.mobility.reduced_mobility': 'Jag har rörelsehinder',
  'settings.mobility.rollator': 'Jag använder rollator',
  'settings.mobility.stroller': 'Jag går med barnvagn',
  'settings.city.info': `{count, plural,
    one {Vald stad} 
    other {Vald städer}
  }`,
  'settings.city.all': 'Visa alla',
  'settings.city.title': 'Stad',
  'settings.city.helsinki': 'Helsingfors',
  'settings.city.espoo': 'Esbo',
  'settings.city.vantaa': 'Vanda',
  'settings.city.kauniainen': 'Grankulla',
  'settings.city.kirkkonummi': 'Kyrkslätt',
  'settings.map.title': 'Kartunderlag',
  'settings.map.servicemap': 'Servicekarta',
  'settings.map.ortographic': 'Flygbild',
  'settings.map.guideMap': 'Guidekarta',
  'settings.map.accessible_map': 'Karta med stor kontrast',
  'settings.aria.changed': 'Inställningarna har ändrats. Kom ihåg att spara.',
  'settings.aria.closed': 'Inställningarna har stängts',
  'settings.aria.open': 'Öppna inställningarna',
  'settings.aria.opened': 'Inställningarna har öppnats',
  'settings.aria.saved': 'Inställningarna har sparats',
  'settings.choose.mobility': 'Valitse liikkumisrajoitteesi', // TODO: translate
  'settings.choose.senses': 'Valitse aistirajoitteesi', // TODO: translate
  'settings.choose.cities': 'Valitse kaupunkiasetuksesi', // TODO: translate
  'settings.map.info': 'Kartta-asetuksista voit valita sinulle parhaiten sopivan pohjakartan.', // TODO: translate

  // Tools
  'tool.download': 'Exportera',
  'tool.measuring': 'Mittaa etäisyys hiirellä', // TODO: translate
  'tool.measuring.stop': 'Sluta mäta',
  'tool.print': 'Skriv ut',

  'info.title': 'Om tjänsten och tillgänglighetsredogörelsen',
  'info.statement': 'Tillgänglighetsredogörelsen',

  'alert.close': 'Stäng meddelande',
};

let overridingExternalTranslations;

// Read and merge external translations with current translations
try {
  // eslint-disable-next-line global-require,import/no-unresolved
  overridingExternalTranslations = require('./externalTranslations/sv.json');
} catch (e) {
  overridingExternalTranslations = {};
}

const swedishTranslations = { ...translations, ...overridingExternalTranslations };
export default swedishTranslations;
