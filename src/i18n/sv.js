/* eslint-disable quote-props */
const translations = {
  'app.title': 'Servicekarta',
  'app.description': 'Alla tjänster i huvudstadsregionen inom räckhåll.',
  'app.og.image.alt': 'Servicekarta logo',

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
  'address.emergency_care.link': 'http://www.hel.fi/www/Helsinki/fi/sosiaali-ja-terveyspalvelut/terveyspalvelut/paivystys/',
  'address.emergency_care.link.text': '[<a>joursidor</a>]',

  // Area
  // TODO: clean unused translations
  'area.searchbar.infoText.address': 'Skriv din hemadress',
  'area.searchbar.infoText.optional': '(valfri)',
  'area.tab.publicServices': 'Områden för offentliga tjänster',
  'area.tab.geographical': 'Stadsdelar och postnummerområden',
  'area.services.local': 'Tjänster i ditt eget område',
  'area.services.nearby': 'Lista över tjänsterna i närområden',
  'area.services.all': 'Lista över tjänsterna',
  'area.info': 'Välj ett område, vars tjänster du vill ha information om. Genom att skriva din hemadress i sökfältet öppnas en karta och under fliken Tjänster i området visas de områden och distrikt som du hör till',
  'area.choose.district': 'Väl område',
  'area.list': 'Val av område',
  'area.localAddress.title': 'Uppgifter enligt din adress',
  'area.localAddress.neighborhood': 'Stadsdel: {area}',
  'area.localAddress.postCode': 'Postnummer: {area}',
  'area.geographicalServices.neighborhood': 'Tjänster i stadsdelen ({length})',
  'area.geographicalServices.postcode_area': 'Tjänster i postnummerområdet ({length})',
  'area.neighborhood.title': 'Välj stadsdel',
  'area.postcode_area.title': 'Välj postnummer',
  'area.noSelection': 'Väl område under fliken Val av område',
  'area.noUnits': 'Det finns inga verksamhetsställen i ditt valda område',
  'area.popupLink': 'Visa uppgifterna för området (ny flik)',
  'area.list.geographical': 'Geografisk',
  'area.list.protection': 'Befolkningsskydd',
  'area.list.health': 'Hälsa',
  'area.list.education': 'Utbildning',
  'area.list.natureConservation': 'Naturskydd',
  'area.list.parking': 'Parkering',
  'area.list.education.finnish': 'Finska skolområden',
  'area.list.education.swedish': 'Svenska skolområden',
  'area.list.preschool': 'Förskoleundervisning',
  'area.list.neighborhood': 'Stadsdel',
  'area.list.postcode': 'Postnummer',
  'area.list.postcode_area': 'Postnummerområde',
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
  'embedder.options.label.units': 'Visa verksamhetsställen',
  'embedder.options.label.transit': 'Visa kollektivtrafikens hållplatser (Zooma in kartan för att se hållplatserna)',
  'embedder.preview.title': 'Map preview',
  'embedder.service.title': 'Tjänster',
  'embedder.service.aria.label': 'Välj tjänsterna som visas',
  'embedder.service.none': 'Kartan visas utan verksamhetsställen',
  'embedder.service.common': 'På kartan visas de vanligaste verksamhetsställena i stadsbons vardag: skolor, daghem och hälsostationer.',
  'embedder.service.all': 'Alla verksamhetsställen visas på kartan. För omfattande områdesgränser gör inbäddningen långsammare och otydligare.',
  'embedder.title': 'Inbäddningsverktyg',
  'embedder.title.info': 'Om du vill göra en inbäddning enligt sökresultat, börja med att göra sökningen.',
  'embedder.url.title': 'Kopiera adressen',
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
  'feedback.srError.required': 'Respons måste fyllas i',
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
  'general.closeSettings': 'Stäng inställningarna',
  'general.fetching': 'Laddar data...',
  'general.home': 'Hem',
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
  'general.pageTitles.area': 'Områdessida.',

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
  'general.time.short': 'kl.',
  'general.tools': 'Verktyg',
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

  // Map
  'map': 'Karta',
  'map.ariaLabel': 'Kartvy. Kartans uppgifter kan i nuläget granskas endast visuellt.',
  'map.attribution.osm': '&copy; <a href="http://osm.org/copyright">Upphovsmännen bakom OpenStreetMaps</a>',
  'map.attribution.helsinki': '&copy; Helsingfors, Esbo, Vanda och Grankulla städer',
  'map.transit.endStation': 'Ändhållplats',
  'map.address.coordinate': 'Dela platskoordinat',
  'map.address.searching': 'Söker adress...',
  'map.address.notFound': 'Adressen hittades ej',
  'map.address.info': 'Adressens uppgifter',
  'map.unit.cluster.popup.info': '{count} verksamhetsställen', // TODO: Verify
  'map.button.sidebar.hide': 'Minska sidopanelen',
  'map.button.sidebar.show': 'Utvidga sidopanelen',

  // Print
  'print.alert': 'Använd utskriftsalternativet i verktygsmenyn',
  'print.button.close': 'Stäng vyn',
  'print.button.print': 'Skriv ut vyn',
  'print.table.header.number': 'Nummer på kartan',

  // Units
  'unit': 'Verksamhetsställe',
  'unit.showInformation': 'Visa uppgifterna för verksamhetsstället',
  'unit.accessibility.hearingMaps': 'Täckningskartor',
  'unit.accessibility.hearingMaps.extra': '(Ny flik. Tjänsten är inte tillgänglig)',
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

  'unit.contact.info': 'Kontaktuppgifter',
  'unit.links': 'På webben',
  'unit.eServices': 'E-tjänster',
  'unit.reservations': 'Objekt som kan reserveras',
  'unit.events': 'Evenemang',
  'unit.events.count': `{count, plural,
    =0 {}
    one {# evenemang}
    other {# evenemang}
  }`,
  'unit.events.more': 'Visa fler evenemang',
  'unit.homepage': 'Hemsida',
  'unit.homepage.missing': 'Ingen hemsida har meddelats',
  'unit.picture': 'Bild av verksamhetsstället',
  'unit.description': 'Information om verksamhetsstället',
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
  'unit.reservations.count': `{count, plural,
    =0 {}
    one {# objekt som kan reserveras}
    other {# objekt som kan reserveras}
  }`,
  'unit.reservations.more': 'Visa fler objekt som kan reserveras',
  'unit.call.number': '(ring)',
  'unit.list.services': 'Tjänster',
  'unit.list.events': 'Evenemang',
  'unit.list.reservations': 'Objekt som kan reserveras',
  'unit.services': 'Tjänster',
  'unit.services.more': 'Visa fler tjänster',
  'unit.services.count': `{count, plural,
    =0 {}
    one {# tjänst}
    other {# tjänster}
  }`,
  'unit.route': 'Se vägen till det här stället',
  'unit.route.extra': '(Ny flik. HRT-reseplaneraren är inte en tillgänglig tjänst)',
  'unit.socialMedia.title': 'Verksamhetsstället på sociala medier',
  'unit.outdoorLink': 'Kolla skicket på en motionsplats i tjänsten ulkoliikunta.fi',
  'unit.seo.description': 'Se läget på kartan',
  'unit.seo.description.accessibility': 'Se tillgänglighetsuppgifterna och läget på kartan',

  // Search
  'search': 'Sök',
  'search.arrowLabel': 'Precisera',
  'search.cancelText': 'Töm sökfältet',
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
  'service.tab': 'Tjänster och evenemang',
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
  'services.tree.level': 'Nivå',

  // Settings
  'settings': 'Inställningar',
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

  // Tools
  'tool.download': 'Exportera',
  'tool.measuring': 'Mät avstånd (endast med mus)',
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
