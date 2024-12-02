import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import Helmet from 'react-helmet';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPage } from '../../../redux/actions/user';
import { selectAddressAdminDistricts } from '../../../redux/selectors/address';
import { selectEvent } from '../../../redux/selectors/general';
import { getSelectedUnit } from '../../../redux/selectors/selectedUnit';
import { selectServiceCurrent } from '../../../redux/selectors/service';
import { uppercaseFirst } from '../../../utils';
import { isEmbed } from '../../../utils/path';
import useLocaleText from '../../../utils/useLocaleText';
import getPageDescriptions from './pageDescriptions';

const PageHandler = (props) => {
  const {
    page = null,
    messageId = 'app.title',
  } = props;

  const intl = useIntl();
  const addressAdminDistricts = useSelector(selectAddressAdminDistricts);
  const event = useSelector(selectEvent);
  const service = useSelector(selectServiceCurrent);
  const unit = useSelector(getSelectedUnit);
  const dispatch = useDispatch();
  const getLocaleText = useLocaleText();
  const embed = isEmbed();

  useEffect(() => {
    // Save current page to redux
    dispatch(setCurrentPage(page));
  }, [page]);

  // Modify html head
  const message = messageId ? intl.formatMessage({ id: messageId }) : '';
  let pageMessage = '';
  const pageDescription = getPageDescriptions(page, unit, addressAdminDistricts, getLocaleText, intl);

  // Add unit or service name to title if needed
  if ((page === 'unit' || page === 'eventList') && unit && unit.name) {
    pageMessage = getLocaleText(unit.name);
  } if (page === 'service' && service && service.name) {
    pageMessage = getLocaleText(service.name);
  } if (page === 'event' && event && event.name) {
    pageMessage = getLocaleText(event.name);
  }

  let appTitle = intl.formatMessage({ id: 'app.title' });

  if (message !== '' || pageMessage !== '') {
    appTitle = ` | ${appTitle}`;
  }

  const title = `${uppercaseFirst(pageMessage)} ${message}${appTitle}`;
  const hideFromCrawlers = ['search', 'info', 'serviceTree', 'feedback', 'mobilityTree'];

  return (
    <Helmet>
      {embed || hideFromCrawlers.includes(page) ? (
        <meta name="robots" content="none" />
      ) : null}
      <title>{title}</title>
      <meta name="description" content={pageDescription} />
    </Helmet>
  );
};

PageHandler.propTypes = {
  messageId: PropTypes.string,
  page: PropTypes.string,
};

export default PageHandler;
