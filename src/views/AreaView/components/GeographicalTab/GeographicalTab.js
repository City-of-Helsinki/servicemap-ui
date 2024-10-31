import styled from '@emotion/styled';
import { FormatListBulleted } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { SMAccordion } from '../../../../components';
import AddressInfo from '../../../../components/AddressInfo/AddressInfo';
import {
  fetchDistrictGeometry,
  fetchDistricts,
  handleOpenGeographicalCategory,
  setSelectedDistrictServices,
  setSelectedDistrictType,
  setSelectedSubdistricts,
} from '../../../../redux/actions/district';
import {
  getDistrictOpenItems,
  getFilteredSubdistrictServices,
  selectDistrictAddressData,
  selectDistrictData,
  selectDistrictsFetching,
  selectSelectedDistrictType,
} from '../../../../redux/selectors/district';
import { selectMapRef } from '../../../../redux/selectors/general';
import { geographicalDistricts } from '../../utils/districtDataHelper';
import DistrictToggleButton from '../DistrictToggleButton';
import GeographicalDistrictList from '../GeographicalDistrictList';
import GeographicalUnitList from '../GeographicalUnitList';
import {
  StyledCaptionText,
  StyledDistrictServiceListLevelThree,
  StyledListItem,
  StyledListNoPaddingLevelTwo,
  StyledLoadingText,
  StyledUnitsAccordion,
} from '../styled/styled';

const GeographicalTab = ({
  initialOpenItems,
  clearRadioButtonValue,
}) => {
  const dispatch = useDispatch();
  const filteredSubdistrictUnitsLength = useSelector(
    state => getFilteredSubdistrictServices(state).length,
  );
  const districtsFetching = useSelector(selectDistrictsFetching);
  const localAddressData = useSelector(selectDistrictAddressData);
  const selectedDistrictType = useSelector(selectSelectedDistrictType);
  const districtData = useSelector(selectDistrictData);
  const map = useSelector(selectMapRef);

  const [openCategory, setOpenCategory] = useState(
    useSelector(getDistrictOpenItems).find(item => geographicalDistricts.includes(item)) || [],
  );

  const setRadioButtonValue = (district) => {
    if (!district.data.some(obj => obj.boundary)) {
      dispatch(fetchDistrictGeometry(district.name));
    }
    dispatch(setSelectedDistrictType(district.id));
    dispatch(setSelectedDistrictServices([]));
    const localDistrict = localAddressData.districts.find(obj => obj.type === district.name);
    if (localDistrict) {
      dispatch(setSelectedSubdistricts([localDistrict.ocd_id]));
    } else {
      dispatch(setSelectedSubdistricts([]));
    }
  };

  const handleCategoryOpen = (id) => {
    setOpenCategory(id);
    dispatch(handleOpenGeographicalCategory(id));
  };

  const handleRadioChange = (district, e) => {
    e.stopPropagation();
    if (selectedDistrictType === district.id) {
      clearRadioButtonValue();
      setOpenCategory(null);
    } else {
      setRadioButtonValue(district);
      handleCategoryOpen(district.id);
    }
  };

  const handleAccordionToggle = (district, opening) => {
    if (opening) {
      if (selectedDistrictType !== district.id) {
        setRadioButtonValue(district);
      }
      handleCategoryOpen(district.id);
    } else {
      setOpenCategory(null);
    }
  };

  useEffect(() => {
    if (!districtData.length) { // Arriving to page first time
      dispatch(fetchDistricts());
    }
  }, []);

  useEffect(() => {
    if (!selectedDistrictType || !geographicalDistricts.includes(selectedDistrictType)) {
      dispatch(setSelectedSubdistricts([]));
      dispatch(setSelectedDistrictServices([]));
      setOpenCategory(null);
    }
  }, [selectedDistrictType]);

  const render = () => {
    const districtItems = districtData.filter(obj => geographicalDistricts.includes(obj.id));
    return (
      <>
        {localAddressData?.address && localAddressData.districts?.length && (
          <AddressInfo address={localAddressData.address} districts={localAddressData.districts} />
        )}
        <Typography style={visuallyHidden} component="h3">
          <FormattedMessage id="area.list" />
        </Typography>
        <StyledListNoPaddingLevelTwo>
          {districtItems.map((district) => {
            const opened = openCategory === district.id;
            const selected = selectedDistrictType === district.id;
            return (
              <StyledListItem
                // divider
                disableGutters
                key={district.id}
                className={`${district.id}`}
              >
                <StyledCategoryListAccordion
                  // Top level categories (neighborhood and postcode area)
                  defaultOpen={initialOpenItems.includes(district.id)}
                  onOpen={(e, open) => handleAccordionToggle(district, !open)}
                  isOpen={opened}
                  elevated={opened}
                  adornment={(
                    <DistrictToggleButton
                      selected={selected}
                      district={district}
                      onToggle={e => handleRadioChange(district, e)}
                      aria-hidden
                    />
                  )}
                  titleContent={(
                    <Typography id={`${district.id}Name`}>
                      <FormattedMessage id={`area.list.${district.name}`} />
                    </Typography>
                  )}
                  collapseContent={(
                    <StyledDistrictServiceListLevelThree>
                      <StyledUnitsAccordion // Unit list accordion
                        defaultOpen={initialOpenItems.some(item => typeof item === 'number')}
                        disabled={!filteredSubdistrictUnitsLength}
                        adornment={<StyledFormatListBulleted />}
                        titleContent={(
                          <StyledCaptionText variant="caption">
                            <FormattedMessage
                              id={`area.geographicalServices.${district.id}`}
                              values={{ length: filteredSubdistrictUnitsLength }}
                            />
                          </StyledCaptionText>
                        )}
                        collapseContent={(
                          <GeographicalUnitList
                            initialOpenItems={initialOpenItems}
                          />
                        )}
                      />
                      <GeographicalDistrictList // District selection list
                        district={district}
                        map={map}
                      />
                    </StyledDistrictServiceListLevelThree>
                  )}
                />
              </StyledListItem>
            );
          })}
        </StyledListNoPaddingLevelTwo>
      </>
    );
  };

  if (!districtData.length && districtsFetching?.length) {
    return (
      <StyledLoadingText>
        <Typography aria-hidden>
          <FormattedMessage id="general.loading" />
        </Typography>
      </StyledLoadingText>
    );
  }

  return render();
};
const StyledCategoryListAccordion = styled(SMAccordion)(({ theme }) => ({
  paddingLeft: theme.spacing(7),
}));

const StyledFormatListBulleted = styled(FormatListBulleted)(({ theme }) => ({
  padding: theme.spacing(2.5),
  paddingLeft: theme.spacing(7),
}));

GeographicalTab.propTypes = {
  initialOpenItems: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
};

GeographicalTab.defaultProps = {
  initialOpenItems: [],
};

export default React.memo(GeographicalTab);
