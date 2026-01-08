# Changelog

## [2.10.2](https://github.com/City-of-Helsinki/servicemap-ui/compare/servicemap-ui-v2.10.1...servicemap-ui-v2.10.2) (2026-01-08)


### Bug Fixes

* Support route details without unit location ([0b22f1b](https://github.com/City-of-Helsinki/servicemap-ui/commit/0b22f1bd29574a94023bef3263a607a267a20ebb))

## [2.10.1](https://github.com/City-of-Helsinki/servicemap-ui/compare/servicemap-ui-v2.10.0...servicemap-ui-v2.10.1) (2025-12-17)


### Bug Fixes

* Csp error from cookie modal PL-199 ([#1312](https://github.com/City-of-Helsinki/servicemap-ui/issues/1312)) ([7bd6186](https://github.com/City-of-Helsinki/servicemap-ui/commit/7bd61869e8d0fdeb57689b42849ba95064926dce))

## [2.10.0](https://github.com/City-of-Helsinki/servicemap-ui/compare/servicemap-ui-v2.9.3...servicemap-ui-v2.10.0) (2025-12-12)


### Features

* Replace mml-tiles url with maps-proxy ([4c59f7b](https://github.com/City-of-Helsinki/servicemap-ui/commit/4c59f7bacedee060e0a3bf77e23abb3a7496e6cb))

## [2.9.3](https://github.com/City-of-Helsinki/servicemap-ui/compare/servicemap-ui-v2.9.2...servicemap-ui-v2.9.3) (2025-12-11)


### Bug Fixes

* Enhance parking area interaction with popups and tooltips ([59449c6](https://github.com/City-of-Helsinki/servicemap-ui/commit/59449c62471a6ac5709562d761e0654dfc17a393))
* Mobile popup close button triggering navigation ([a65495a](https://github.com/City-of-Helsinki/servicemap-ui/commit/a65495acd3ae8881ede78a7f2281bf52837f5b33))
* Parking areas as an object for improved efficiency ([21ddfff](https://github.com/City-of-Helsinki/servicemap-ui/commit/21ddfffacc38065878a71adbc0ea0884df9bce49))
* Reduce the number of api calls ([cff2139](https://github.com/City-of-Helsinki/servicemap-ui/commit/cff2139e96ca1ab4ad2646c16ae49596a4de54e0))


### Dependencies

* Bump @sentry/node from 10.22.0 to 10.27.0 ([b14bf72](https://github.com/City-of-Helsinki/servicemap-ui/commit/b14bf728acc6699bd427403a73520ee04a22f044))
* Bump mdast-util-to-hast from 13.2.0 to 13.2.1 ([68e75e7](https://github.com/City-of-Helsinki/servicemap-ui/commit/68e75e7885d0e4dd6069a94e0c41480187c5e827))
* Bump vite from 7.1.7 to 7.1.11 ([e9b5045](https://github.com/City-of-Helsinki/servicemap-ui/commit/e9b5045e98916753bf3d62fe006f0dd8f0dc9350))

## [2.9.2](https://github.com/City-of-Helsinki/servicemap-ui/compare/servicemap-ui-v2.9.1...servicemap-ui-v2.9.2) (2025-11-25)


### Bug Fixes

* Add null checks for address text and button references in AddressPopup PL-172 ([6b221fa](https://github.com/City-of-Helsinki/servicemap-ui/commit/6b221fa47ddaa5c3bbf3bc95f784f2cd587068ab))
* Add Sentry Vite plugin  and update dependencies ([9a51327](https://github.com/City-of-Helsinki/servicemap-ui/commit/9a513273a1fb99377e1e1bb2aeac2f1fea06db04))
* Added missing commit lint configurations ([#1300](https://github.com/City-of-Helsinki/servicemap-ui/issues/1300)) ([3b3353d](https://github.com/City-of-Helsinki/servicemap-ui/commit/3b3353deb8e0947f4dbcae3c8f99c271676f9e8f))
* Adjust ssr external deps Ref: PL-190 ([6fcc783](https://github.com/City-of-Helsinki/servicemap-ui/commit/6fcc7830fa1ef8e4e5d04007f914c431d36fe142))
* Handle subwayResponse errors in fetchStops function PL-178 ([72d43a5](https://github.com/City-of-Helsinki/servicemap-ui/commit/72d43a5280d25dc47fff7a9eaa32f8cdfa8d22e2))
* Info page links ([28eba22](https://github.com/City-of-Helsinki/servicemap-ui/commit/28eba224d60630ee1e28f515f80f2d6db2b2775c))
* Minify distributed code and enable compression Ref: PL-190 ([6c0184f](https://github.com/City-of-Helsinki/servicemap-ui/commit/6c0184fe3920f65c4eddf1c2d9b7e4efad62a5ed))
* Remove unused redirect ([#1292](https://github.com/City-of-Helsinki/servicemap-ui/issues/1292)) ([3cef1fc](https://github.com/City-of-Helsinki/servicemap-ui/commit/3cef1fc8c34ad4365898460685c4d9ac3787875e))
* ResetUrlSearchParams don't call if no params Ref: PL-175 ([d04d133](https://github.com/City-of-Helsinki/servicemap-ui/commit/d04d1339870348bb328c667f350d5b7c013d2de6))
* Revert white nav buttons height ([#1290](https://github.com/City-of-Helsinki/servicemap-ui/issues/1290)) ([9059342](https://github.com/City-of-Helsinki/servicemap-ui/commit/9059342ddd354f66340bbe911791d23bf724fbdd))
* TransitFetch add error handling Ref: PL-168 ([d2242e3](https://github.com/City-of-Helsinki/servicemap-ui/commit/d2242e37c80162669d259a1a22f92ffc704991cd))
* TransitStops delay when moving map Ref: PL-168 ([d2242e3](https://github.com/City-of-Helsinki/servicemap-ui/commit/d2242e37c80162669d259a1a22f92ffc704991cd))
* TransitStops digitransitAPI logic fixes Ref: PL-168 ([d2242e3](https://github.com/City-of-Helsinki/servicemap-ui/commit/d2242e37c80162669d259a1a22f92ffc704991cd))


### Dependencies

* Bump js-yaml from 4.1.0 to 4.1.1 ([#1298](https://github.com/City-of-Helsinki/servicemap-ui/issues/1298)) ([5941a50](https://github.com/City-of-Helsinki/servicemap-ui/commit/5941a50d2d1991e80d6a51040f6c6f8645698223))

## [2.9.1](https://github.com/City-of-Helsinki/servicemap-ui/compare/servicemap-ui-v2.9.0...servicemap-ui-v2.9.1) (2025-10-29)


### Bug Fixes

* Remove typo in creative commons text ([#1286](https://github.com/City-of-Helsinki/servicemap-ui/issues/1286)) ([b31b017](https://github.com/City-of-Helsinki/servicemap-ui/commit/b31b0177d37a8a714a1b538d9a77171131ab7b89))

## [2.9.0](https://github.com/City-of-Helsinki/servicemap-ui/compare/servicemap-ui-v2.8.0...servicemap-ui-v2.9.0) (2025-10-27)


### Features

* About service add Creative Commons license Ref: PL-154 ([b60a623](https://github.com/City-of-Helsinki/servicemap-ui/commit/b60a623c7f9e965d81fabdbd49b6f927a238171e))
* Add InfoView unit tests Ref: PL-154 ([65c4a22](https://github.com/City-of-Helsinki/servicemap-ui/commit/65c4a22be7ac6ee9ace50b030d480b69515ea4f9))
* Cloud sentry PL-143  ([#1284](https://github.com/City-of-Helsinki/servicemap-ui/issues/1284)) ([198d446](https://github.com/City-of-Helsinki/servicemap-ui/commit/198d446502775b72f909557d1120d7d2837ec38d))
* Remove helsinki maptiles feature flag ([2e25d54](https://github.com/City-of-Helsinki/servicemap-ui/commit/2e25d548ee3d875e83284f4df8b011933acc191b))


### Bug Fixes

* TransitStops clear when page changes Ref: PL-136 ([7b53421](https://github.com/City-of-Helsinki/servicemap-ui/commit/7b534218d63ae1bce202fa2b3a9e818cf2524b19))

## [2.8.0](https://github.com/City-of-Helsinki/servicemap-ui/compare/servicemap-ui-v2.7.0...servicemap-ui-v2.8.0) (2025-10-07)


### Features

* Migrate CRA + webpack to vite Ref: PL-89 ([efec884](https://github.com/City-of-Helsinki/servicemap-ui/commit/efec884608596389110b97e4c29f1bf591153bf4))


### Bug Fixes

* Inject client env variables correctly Ref: PL-89 ([40933f4](https://github.com/City-of-Helsinki/servicemap-ui/commit/40933f40f41df5f91c7c99610821738da4e6a278))

## [2.7.0](https://github.com/City-of-Helsinki/servicemap-ui/compare/servicemap-ui-v2.6.0...servicemap-ui-v2.7.0) (2025-10-02)


### Features

* Migrate react-helment to react-helmet-async Ref: PL-89 ([13b3915](https://github.com/City-of-Helsinki/servicemap-ui/commit/13b39156d5635c18812b320c9bcb108bbc880f0c))
* Update HDS to version 4.7.1 PL-145 ([#1273](https://github.com/City-of-Helsinki/servicemap-ui/issues/1273)) ([ac4c3b8](https://github.com/City-of-Helsinki/servicemap-ui/commit/ac4c3b88cffab26b3a0c6f39036320b4ec130c4e))
* Upgrade @testing-library/react to 16.0.1 Ref: PL-89 ([c8a834c](https://github.com/City-of-Helsinki/servicemap-ui/commit/c8a834cd1358caa91c48031d3521401ee7783e10))
* Upgrade react-router to 6.30.1 Ref: PL-89 ([19ce6db](https://github.com/City-of-Helsinki/servicemap-ui/commit/19ce6db19a715746976475e4a5b049a755a39ccc))


### Bug Fixes

* Hydration and router migration fixes Ref: PL-89 ([65c75ce](https://github.com/City-of-Helsinki/servicemap-ui/commit/65c75ce0655a1ca40e16ed66608e3add2badb72f))
* Lineheight ([#1274](https://github.com/City-of-Helsinki/servicemap-ui/issues/1274)) ([40e0a27](https://github.com/City-of-Helsinki/servicemap-ui/commit/40e0a270836e73828718fcec2eae51121d93d297))
* Stricter yarn configuration ([b0d9044](https://github.com/City-of-Helsinki/servicemap-ui/commit/b0d904410a4e0bdfc59053cb7a2ed90ea118533f))

## [2.6.0](https://github.com/City-of-Helsinki/servicemap-ui/compare/servicemap-ui-v2.5.2...servicemap-ui-v2.6.0) (2025-09-05)


### Features

* Add CSP support ([9e2bf90](https://github.com/City-of-Helsinki/servicemap-ui/commit/9e2bf90bb6b4304a967545cb690f01df2bfa0fac))
* MapView enable loading indicator for service unit search PL-71 ([e506f2c](https://github.com/City-of-Helsinki/servicemap-ui/commit/e506f2cc8333271833b74f94b298e13c2811c5a1))


### Bug Fixes

* Add CSP_SCRIPT_SRC and include analytics ([8c59e79](https://github.com/City-of-Helsinki/servicemap-ui/commit/8c59e79b26484d3d5a49c8b8883e79650ba9e40b))
* Add missing nonce param and remove hardcoded connect-src values ([9a3b5a4](https://github.com/City-of-Helsinki/servicemap-ui/commit/9a3b5a494dbbdeb90d0eeb57dc9ac4e095c6d223))

## [2.5.2](https://github.com/City-of-Helsinki/servicemap-ui/compare/servicemap-ui-v2.5.1...servicemap-ui-v2.5.2) (2025-08-08)


### Bug Fixes

* Linter errors and warnings ([ba35155](https://github.com/City-of-Helsinki/servicemap-ui/commit/ba35155c1421c32af96cdca31f8ee667aa2d1b26))
* Search view handle search params PL-119 ([c952290](https://github.com/City-of-Helsinki/servicemap-ui/commit/c9522905dc30d7b6e37523e826374344ae13ea21))
* UseEffect dependency warnings on ([844d061](https://github.com/City-of-Helsinki/servicemap-ui/commit/844d061c800793b80d6b3ef7a79b96e4b611ad6a))

## [2.5.1](https://github.com/City-of-Helsinki/servicemap-ui/compare/servicemap-ui-v2.5.0...servicemap-ui-v2.5.1) (2025-07-21)


### Bug Fixes

* Validate that units are real objects PL-114 ([#1256](https://github.com/City-of-Helsinki/servicemap-ui/issues/1256)) ([8e6336f](https://github.com/City-of-Helsinki/servicemap-ui/commit/8e6336f283d227101cf218259a25409d1c3bf81e))
* Yarn install on docker PL-92 ([#1253](https://github.com/City-of-Helsinki/servicemap-ui/issues/1253)) ([9ef9414](https://github.com/City-of-Helsinki/servicemap-ui/commit/9ef9414ce4e677d45402ef88a95c9ae4473eee37))

## [2.5.0](https://github.com/City-of-Helsinki/servicemap-ui/compare/servicemap-ui-v2.4.0...servicemap-ui-v2.5.0) (2025-07-07)


### Features

* Adapt to new statistical districts schema ([f95b804](https://github.com/City-of-Helsinki/servicemap-ui/commit/f95b8049a9c8270cd585225fd8e648f61c20b225))


### Bug Fixes

* Encode search query to handle special characters ([#1249](https://github.com/City-of-Helsinki/servicemap-ui/issues/1249)) ([a4af679](https://github.com/City-of-Helsinki/servicemap-ui/commit/a4af679e7842dc662de6c7551aae568360355e95))


### Dependencies

* Bump http-proxy-middleware from 2.0.7 to 2.0.9 ([#1242](https://github.com/City-of-Helsinki/servicemap-ui/issues/1242)) ([adc6f28](https://github.com/City-of-Helsinki/servicemap-ui/commit/adc6f28fd025bc32e6f5cb0680443796c0ecb831))

## [2.4.0](https://github.com/City-of-Helsinki/servicemap-ui/compare/servicemap-ui-v2.3.1...servicemap-ui-v2.4.0) (2025-06-04)


### Features

* Add support for helsinki maptiles ([b37faf1](https://github.com/City-of-Helsinki/servicemap-ui/commit/b37faf1144998fee2cd95fdceb1deba2c4cd9f9a))


### Bug Fixes

* UnitView refetch hearingMaps ([cdc72ee](https://github.com/City-of-Helsinki/servicemap-ui/commit/cdc72eed0d82310d974ee6f131264984984fab60))

## [2.3.1](https://github.com/City-of-Helsinki/servicemap-ui/compare/servicemap-ui-v2.3.0...servicemap-ui-v2.3.1) (2025-05-20)


### Dependencies

* Bump path-to-regexp and express ([#1239](https://github.com/City-of-Helsinki/servicemap-ui/issues/1239)) ([49b607a](https://github.com/City-of-Helsinki/servicemap-ui/commit/49b607a55f55c5ec3670e16eedd2a223ea735ee6))

## [2.3.0](https://github.com/City-of-Helsinki/servicemap-ui/compare/servicemap-ui-v2.2.0...servicemap-ui-v2.3.0) (2025-05-13)


### Features

* Convert TestCafe tests ([#1237](https://github.com/City-of-Helsinki/servicemap-ui/issues/1237)) ([6dedae1](https://github.com/City-of-Helsinki/servicemap-ui/commit/6dedae1f7b6521aeddebd4742c73821209aca769))
* Dockerfile use redhat Node image PL-51 ([#1241](https://github.com/City-of-Helsinki/servicemap-ui/issues/1241)) ([840a580](https://github.com/City-of-Helsinki/servicemap-ui/commit/840a5802f52837db1982824d36e83f9585134d26))

## [2.2.0](https://github.com/City-of-Helsinki/servicemap-ui/compare/servicemap-ui-v2.1.0...servicemap-ui-v2.2.0) (2025-03-13)


### Features

* Migrate to DigiTransit Routing API v2 ([071b1a4](https://github.com/City-of-Helsinki/servicemap-ui/commit/071b1a417f380fc41faaf1230540a91fd30bf25f))

## [2.1.0](https://github.com/City-of-Helsinki/servicemap-ui/compare/servicemap-ui-v2.0.35...servicemap-ui-v2.1.0) (2025-02-26)


### Features

* **digitransit-api:** Utilize digitransit-proxy ([c44c6f4](https://github.com/City-of-Helsinki/servicemap-ui/commit/c44c6f46231f145496dfd095210e661a791a8a1c))


### Bug Fixes

* **hsl-icons:** Fix HSL TransitStop icon styles ([c3f2857](https://github.com/City-of-Helsinki/servicemap-ui/commit/c3f28575ffcfe6551280eed3293a810ed3b5504d))

## [2.0.35](https://github.com/City-of-Helsinki/servicemap-ui/compare/servicemap-ui-v2.0.34...servicemap-ui-v2.0.35) (2025-01-29)


### Bug Fixes

* Change defaultProps to JS default parameters ([72d5f01](https://github.com/City-of-Helsinki/servicemap-ui/commit/72d5f01ef6b1e32d8a5e39c02fcfb78e5c63d961))
* Use NoSsr-tag to resolve hydration errors ([98bcf15](https://github.com/City-of-Helsinki/servicemap-ui/commit/98bcf15d1510c174c26fe1f43924d1a721fa49d1))
* Use useEffect hook instead of useLayoutEffect ([3ebbe69](https://github.com/City-of-Helsinki/servicemap-ui/commit/3ebbe69c3030ff3239935f6f391892fe14a5b6cd))
