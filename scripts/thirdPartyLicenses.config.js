/**
 * Everything about the third-party license notices that is specific to this
 * repository. The generator itself comes from the license-notices package and
 * knows nothing about this project.
 *
 * This application has no Sass pipeline, so no packages are inlined behind the
 * bundler's back.
 *
 * @type {import('@city-of-helsinki/license-notices').ThirdPartyLicensesConfig}
 */
export const thirdPartyLicensesConfig = {
  repositoryUrl: 'https://github.com/City-of-Helsinki/servicemap-ui',

  licenseDecisions: {
    dompurify: {
      declared: '(MPL-2.0 OR Apache-2.0)',
      license: 'Apache-2.0',
      note:
        'Offered by its author under "(MPL-2.0 OR Apache-2.0)". This ' +
        'distribution elects Apache-2.0, so the MPL-2.0 obligations do not ' +
        'apply to this component.',
    },
  },
};
