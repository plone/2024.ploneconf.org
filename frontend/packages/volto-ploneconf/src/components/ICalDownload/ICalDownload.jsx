import { UniversalLink } from '@plone/volto/components';
import { Button, CalendarIcon, Tooltip } from '@plone/components';
import { TooltipTrigger } from 'react-aria-components';

const ICalDownload = ({ icalHref, message }) => {
  return (
    <TooltipTrigger>
      <UniversalLink href={icalHref} className={'ical'}>
        <Button className="icalButton" aria-label={message}>
          <CalendarIcon />
        </Button>
      </UniversalLink>
      <Tooltip layout={'centered'}>{message}</Tooltip>
    </TooltipTrigger>
  );
};

export default ICalDownload;
