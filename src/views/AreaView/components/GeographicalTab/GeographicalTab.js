import styled from '@emotion/styled';
import { FormatListBulleted, LocationOn } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { SMAccordion } from '../../../../components';
import {
  fetchDistrictGeometry,
  handleOpenGeographicalCategory,
  setSelectedDistrictServices,
  setSelectedDistrictType,
  setSelectedSubdistricts,
} from '../../../../redux/actions/district';
import { getFilteredSubdistrictServices } from '../../../../redux/selectors/district';
import { getAddressText } from '../../../../utils/address';
import useLocaleText from '../../../../utils/useLocaleText';
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
  const districtsFetching = useSelector(state => state.districts.districtsFetching);
  const localAddressData = useSelector(state => state.districts.districtAddressData);
  const selectedDistrictType = useSelector(state => state.districts.selectedDistrictType);
  const districtData = useSelector(state => state.districts.districtData);
  const map = useSelector(state => state.mapRef);
  const getLocaleText = useLocaleText();

  const [openCategory, setOpenCategory] = useState(
    useSelector(state => state.districts.openItems).find(item => geographicalDistricts.includes(item)) || [],
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
    if (!selectedDistrictType || !geographicalDistricts.includes(selectedDistrictType)) {
      dispatch(setSelectedSubdistricts([]));
      dispatch(setSelectedDistrictServices([]));
      setOpenCategory(null);
    }
  }, [selectedDistrictType]);

  const renderAddressInfo = useCallback(() => {
    const localPostArea = localAddressData.districts.find(obj => obj.type === 'postcode_area');
    const localNeighborhood = localAddressData.districts.find(obj => obj.type === 'neighborhood');
    return (
      <StyledAddressInfoContainer>
        <StyledAddressInfoText component="h3"><FormattedMessage id="area.localAddress.title" /></StyledAddressInfoText>
        <StyledAddressInfoIconArea>
          <StyledAddressInfoIcon color="primary" />
          <Typography component="p" variant="subtitle1">{getAddressText(localAddressData.address, getLocaleText)}</Typography>
        </StyledAddressInfoIconArea>
        {localPostArea ? (
          <StyledAddressInfoText>
            <FormattedMessage id="area.localAddress.postCode" values={{ area: getLocaleText(localPostArea.name) }} />
          </StyledAddressInfoText>
        ) : null}
        {localNeighborhood ? (
          <StyledAddressInfoText>
            <FormattedMessage id="area.localAddress.neighborhood" values={{ area: getLocaleText(localNeighborhood.name) }} />
          </StyledAddressInfoText>
        ) : null}
      </StyledAddressInfoContainer>
    );
  }, [localAddressData]);


  const render = () => {
    const districtItems = districtData.filter(obj => geographicalDistricts.includes(obj.id));
    return (
      <>
        {localAddressData?.address && localAddressData.districts?.length && (
          renderAddressInfo()
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

  if (!districtData.length && districtsFetching) {
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

const StyledAddressInfoContainer = styled('div')(({ theme }) => ({
  backgroundColor: '#E3F3FF',
  textAlign: 'left',
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(4),
}));

const StyledAddressInfoText = styled(Typography)(() => ({
  paddingLeft: 62,
}));

const StyledAddressInfoIconArea = styled('div')(({ theme }) => ({
  display: 'flex',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(1),
}));

const StyledAddressInfoIcon = styled(LocationOn)(({ theme }) => ({
  width: 50,
  paddingRight: theme.spacing(1.5),
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
