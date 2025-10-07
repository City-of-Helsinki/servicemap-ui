# Changelog

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
