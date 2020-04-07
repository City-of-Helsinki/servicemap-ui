import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import ResultItem from '../../../components/ListItems/ResultItem';
import { AreaIcon } from '../../../components/SMIcon';
import MobileComponent from '../../../components/MobileComponent';
import DesktopComponent from '../../../components/DesktopComponent';

const DistrictItem = ({
  district, title, period, showDistrictOnMap, intl,
}) => (
  <>
    <MobileComponent>
      <ResultItem
        role="link"
        srLabel={intl.formatMessage({ id: 'address.show.area' })}
        icon={<AreaIcon />}
        title={title}
        subtitle={intl.formatMessage({ id: `address.list.${district.type}` })}
        bottomText={period}
        onClick={() => { showDistrictOnMap(district, true); }}
      />
    </MobileComponent>
    <DesktopComponent>
      <ResultItem
        role="button"
        srLabel={intl.formatMessage({ id: 'address.show.area' })}
        icon={<AreaIcon />}
        title={title}
        subtitle={intl.formatMessage({ id: `address.list.${district.type}` })}
        bottomText={period}
        onClick={() => { showDistrictOnMap(district, false); }}
      />
    </DesktopComponent>
  </>
);

DistrictItem.propTypes = {
  district: PropTypes.objectOf(PropTypes.any).isRequired,
  title: PropTypes.string.isRequired,
  period: PropTypes.string,
  showDistrictOnMap: PropTypes.func.isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

DistrictItem.defaultProps = {
  period: null,
};

export default injectIntl(DistrictItem);
