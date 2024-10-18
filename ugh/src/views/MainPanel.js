import kind from '@enact/core/kind';
import { Panel } from '@enact/sandstone/Panels';
import QrReader from '../components/QrReader';

const MainPanel = kind({
	name: 'MainPanel',

	render: (props) => (
		<Panel {...props}>
			<QrReader />
		</Panel>
	)
});

export default MainPanel;
