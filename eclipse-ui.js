'use strict';

import eclipse from 'eclipse';
import Dropdown from './lib/Dropdown';
import Spinner from './lib/Spinner';
import {staticTabs as StaticTabs, adaptiveTabs as AdaptiveTabs} from './lib/Tabs';
import Bundle from './lib/Bundle';
import Search from './lib/Search';

eclipse.namespace('UI');

eclipse.UI.Dropdown = Dropdown;
eclipse.UI.Spinner = Spinner;
eclipse.UI.StaticTabs = StaticTabs;
eclipse.UI.AdaptiveTabs = AdaptiveTabs;
eclipse.UI.Bundle = Bundle;
eclipse.UI.Search = Search;