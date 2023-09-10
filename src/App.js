import logo from './logo.svg';
import { useEffect, useState } from 'react';
import {
	Box,
	Button,
	FormControlLabel,
	MenuItem,
	Paper,
	Select,
	Stack,
	Switch,
	Tab,
	Tabs,
	TextField,
	Typography,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import { smsLimits, tgLimits, vkLimits, wpLimits } from './utils/constants';
import StandardButtonsList from './components/StundardButtonsList';
import InlineButtonsList from './components/InlineButtonsList';

//Template of custom panel tab
function CustomTabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography
						component={'span'}
						sx={{ display: 'flex', flexWrap: 'wrap', rowGap: '10px' }}
					>
						{children}
					</Typography>
				</Box>
			)}
		</div>
	);
}


function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

function App() {
	const [addedChannels, setAddedChannels] = useState([]);

	useEffect(() => {
		//Checking the saved data, if they are present, fill the variables
		const saved = localStorage.getItem('channels');
		const initialValue = JSON.parse(saved);
		if (initialValue) {
			setAddedChannels(initialValue);
			const currentChannelsNames = channelsNames.filter(
				channelsName =>
					!initialValue.find(item => item.name == channelsName.name)
			);
			setChannelsNames(currentChannelsNames);
			setSelectedChannel(currentChannelsNames[0]);
		}
	}, []);

	const [channelsNames, setChannelsNames] = useState([
		{ name: 'ВКонтакте', limits: vkLimits },
		{ name: 'Telegram', limits: tgLimits },
		{ name: 'WhatsApp', limits: wpLimits },
		{ name: 'SMS', limits: smsLimits },
	]);

	const [selectedChannel, setSelectedChannel] = useState(channelsNames[0]);

	//adding new channel
	const addChannelHandler = () => {
		if (addedChannels.length < 4) {
			const currentAddedChannel = {
				...selectedChannel,
				textMessage: '',
				isInlineKeyboardButtons: false,
				standardKeyboardButtons: [],
				inlineKeyboardButtons: [],
			};
			setAddedChannels([...addedChannels, currentAddedChannel]);
			const currentChannels = channelsNames.filter(
				channel => channel.name != selectedChannel.name
			);
			setSelectedChannel(currentChannels[0]);
			setChannelsNames(currentChannels);
		}
	};

	//delete a channel from the list
	const delChannelHandler = channel => {
		const currentAddedChannels = addedChannels.filter(
			currentChannel => currentChannel.name != channel.name
		);
		setAddedChannels(currentAddedChannels);
		setSelectedChannel(channel);
		setChannelsNames([...channelsNames, channel]);
		setTabValue(0);
	};

	//saving the message to a channel array
	const textMessageHandler = (e, channel) => {
		if (
			e.target.value.length <= channel.limits.mesLength ||
			channel.limits.mesLength === -1
		) {
			channel.textMessage = e.target.value;
			const newAddedChannels = addedChannels.map(currentChannel =>
				currentChannel.name != channel.name ? currentChannel : channel
			);
			setAddedChannels(newAddedChannels);
		}
	};

	const [tabValue, setTabValue] = useState(0);

	const handleTabChange = (event, newValue) => {
		// Checking who triggered the tab change
		if (event.target.id) {
			setTabValue(newValue);
		}
	};

	function customIcon(channel) {
		return (
			<CloseIcon
				fontSize='small'
				onClick={() => delChannelHandler(channel)}
				className='svgClose'
				sx={{
					':hover': {
						color: 'red',
						cursor: 'pointer',
					},
				}}
			/>
		);
	}

	//data saving
	const saveButtonHandler = () => {
		localStorage.setItem('channels', JSON.stringify(addedChannels));
	};

	return (
		<div className='App'>
			<div
				style={{
					display: 'flex',
					padding: '5px',
					justifyContent: 'space-between',
				}}
			>
				<Stack spacing={2} direction='row'>
					<Button
						variant='contained'
						onClick={addChannelHandler}
						disabled={!(addedChannels.length < 4)}
					>
						Добавить канал
					</Button>
					<Select
						value={selectedChannel || ''}
						onChange={e => setSelectedChannel(e.target.value)}
						variant='outlined'
						style={{
							visibility: addedChannels.length < 4 ? 'visible' : 'hidden',
						}}
					>
						{channelsNames.map((channel, index) => {
							return (
								<MenuItem value={channel} key={index}>
									{channel.name}
								</MenuItem>
							);
						})}
					</Select>
				</Stack>

				<Button variant='contained' onClick={saveButtonHandler} color='info'>
					Сохранить
				</Button>
			</div>

			{addedChannels.length > 0 ? (
				<Box sx={{ width: '100%' }}>
					<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
						<Tabs
							value={tabValue}
							onChange={handleTabChange}
							aria-label='basic tabs example'
						>
							{addedChannels.map((channel, index) => {
								return (
									<Tab
										label={channel.name}
										{...a11yProps(index)}
										key={index}
										icon={customIcon(channel)}
										iconPosition='end'
									/>
								);
							})}
						</Tabs>
					</Box>
					{addedChannels.map((channel, index) => {
						return (
							<CustomTabPanel value={tabValue} index={index} key={index}>
								<div
									style={{
										display: 'flex',
										width: '100%',
										alignItems: 'center',
									}}
								>
									<span style={{ marginRight: '10px' }}>Сообщение:</span>
									<TextField
										variant='outlined'
										label={
											channel.textMessage.length
												? `Текст сообщения ${channel.textMessage.length}/${
														channel.limits.mesLength !== -1
															? channel.limits.mesLength
															: '∞'
												  }`
												: ''
										}
										placeholder='Текст сообщения'
										multiline={true}
										value={channel.textMessage}
										onChange={e => textMessageHandler(e, channel)}
										fullWidth
									/>
								</div>
								{channel.limits.standardButtonsCount === 0 ||
								channel.limits.inlineButtonsCount === 0 ? (
									<></>
								) : channel.isInlineKeyboardButtons ? (
									<InlineButtonsList
										channel={channel}
										addedChannels={addedChannels}
										setAddedChannels={setAddedChannels}
										index={index}
									/>
								) : (
									<StandardButtonsList
										channel={channel}
										addedChannels={addedChannels}
										setAddedChannels={setAddedChannels}
										index={index}
									/>
								)}
							</CustomTabPanel>
						);
					})}
				</Box>
			) : (
				<></>
			)}
		</div>
	);
}

export default App;
