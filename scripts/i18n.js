import en from '../i18n/en.json' assert { type: 'json' };
import es from '../i18n/es.json' assert { type: 'json' };

const testTranslateTemplate = /\{\{([a-zA-Z0-9_.]*)\}\}/; 

const languages = {
  en,
  es,
}

export const translate = (lang = 'es') => {
  const dom = document.querySelectorAll('body *');
  const treeWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_ALL,
    null,
    false
  );

  // translate text nodes
  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode;

    if (node.nodeType === Node.TEXT_NODE) {
      const textMatched = node.customTranslateTemplate ? node.customTranslateTemplate.match(testTranslateTemplate) : node.nodeValue.match(testTranslateTemplate);
      let matched = '';

      if(textMatched) {
        if(!node.customTranslateTemplate) {
          addTemplateProp(node, textMatched[0]);
        }
        matched = node.customTranslateTemplate.match(testTranslateTemplate);
      }

      if(matched) {
        const value = buildTranslateString(matched, languages[lang]);
        
        node.nodeValue = value;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      node.getAttributeNames()
      .forEach(atr => {
        let matched;
        const textMatched = node.customTranslateTemplate ? node?.customTranslateTemplate[atr]?.match(testTranslateTemplate) : node.getAttribute(atr).match(testTranslateTemplate);
  
        if(textMatched) {
          addTemplateProp(node, textMatched[0], atr);
          matched = node.customTranslateTemplate[atr].match(testTranslateTemplate);
        }

        if(matched) {
          const value = buildTranslateString(matched, languages[lang]);
          
          node.setAttribute(atr, value);
        }
      });
    }
  }
}

function addTemplateProp(node, template, atr = null) {
  if (node.nodeType === Node.ELEMENT_NODE) {
    const customTranslateTemplate = node.customTranslateTemplate || {};
    customTranslateTemplate[atr] = template;

    node['customTranslateTemplate'] = {...customTranslateTemplate };

    console.log(customTranslateTemplate)
  } else {
    if(node.setAttribute) {
      node.setAttribute('customTranslateTemplate', template);
    } else {
      node.customTranslateTemplate = template;
    }
  };
}

function buildTranslateString(matched, lang) {
  const jsonString = matched[1];
  const parts = jsonString.split('.');
  
  return parts.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, lang);
}