import SectionMessage from '@atlaskit/section-message';
import React from 'react';

export default function initFlex() {
  const [excitementLevel, setExcitementLevel] = React.useState(0);
  const onApTest = () => {
      AP.user.getLocale(function(locale){
          console.log('locale',locale);
          alert(locale);
      });
  };
  return <SectionMessage
      
      title={`flex, world${excitementLevel ? new Array(excitementLevel).fill('!').join('') : '.'}`}

      actions={[
        {
          key: '1',
          href: 'https://atlassian.design/components/',
          text: 'Browse more components to add to your app',
        },
        {
          key: '2',
          onClick: () => setExcitementLevel(excitementLevel + 1),
          text: 'Get excited!',
        }
      ]}
    >
      <p>
        Congratulations! You have successfully created an Atlassian Connect app using the <a href={'https://bitbucket.org/atlassian/atlassian-connect-express'}>atlassian-connect-express</a> client library.
      </p>
      <button onClick={onApTest}>apTest</button>
    </SectionMessage>;
}
