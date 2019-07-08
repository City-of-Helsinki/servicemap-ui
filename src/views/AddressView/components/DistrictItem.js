import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import ResultItem from '../../../components/ListItems/ResultItem';
import { MobileComponent, DesktopComponent } from '../../../layouts/WrapperComponents/WrapperComponents';
import { AreaIcon } from '../../../components/SMIcon';

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
        bottomRightText={period}
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
        bottomRightText={period}
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
  intl: intlShape.isRequired,
};

DistrictItem.defaultProps = {
  period: null,
};

export default injectIntl(DistrictItem);
