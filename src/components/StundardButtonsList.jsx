import { Button, FormControlLabel, Switch, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { memo, useState } from 'react';

const StandardButtonsList = ({
	channel,
	addedChannels,
	setAddedChannels,
	index,
}) => {

	const switchSingleButtonTypeHandler = (channel, button, index) => {
		channel.standardKeyboardButtons[index].isLinkButton = !button.isLinkButton;
		channel.standardKeyboardButtons[index].text = '';

		const newAddedChannels = addedChannels.map(currentChannel =>
			currentChannel.name !== channel.name ? currentChannel : channel
		);

		setAddedChannels(newAddedChannels);
	};

	const inlineButtonTypeSwitchHandler = channel => {
		channel.isInlineKeyboardButtons = !channel.isInlineKeyboardButtons;

		const newAddedChannels = addedChannels.map(currentChannel =>
			currentChannel.name != channel.name ? currentChannel : channel
		);

		setAddedChannels(newAddedChannels);
	};

	const delButtonHandler = (channel, index) => {
		channel.standardKeyboardButtons.splice(index, 1);

		const newAddedChannels = addedChannels.map(currentChannel =>
			currentChannel.name !== channel.name ? currentChannel : channel
		);

		setAddedChannels(newAddedChannels);
	};

	const buttonNameHandler = (e, channel, index) => {
		if (e.target.value.length <= 20) {
			channel.standardKeyboardButtons[index].name = e.target.value;

			const newAddedChannels = addedChannels.map(currentChannel =>
				currentChannel.name !== channel.name ? currentChannel : channel
			);

			setAddedChannels(newAddedChannels);
		}
	};

	const addButtonHandler = channel => {
		if (
			channel.standardKeyboardButtons.length <
				channel.limits.standardButtonsCount ||
			channel.limits.standardButtonsCount === -1
		) {
			channel.standardKeyboardButtons = [
				...channel.standardKeyboardButtons,
				{ name: '', text: '', isLinkButton: false },
			];
			const newAddedChannels = addedChannels.map(currentChannel =>
				currentChannel.name != channel.name ? currentChannel : channel
			);
			setAddedChannels(newAddedChannels);
		}
	};

	const buttonTextHandler = (e, channel, index) => {
		if (
			e.target.value.length <= channel.limits.standardButtonTextLength ||
			channel.limits.standardButtonTextLength === -1
		) {
			channel.standardKeyboardButtons[index].text = e.target.value;

			const newAddedChannels = addedChannels.map(currentChannel =>
				currentChannel.name != channel.name ? currentChannel : channel
			);

			setAddedChannels(newAddedChannels);
		}
	};

	return (
		<div
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				rowGap: '10px',
			}}
		>
			<div
				style={{
					display: 'flex',
					width: '100%',
					alignItems: 'center',
					columnGap: '10px',
				}}
			>
				<span>
					Клавиатура ({channel.standardKeyboardButtons.length}/
					{channel.limits.standardButtonsCount !== -1
						? channel.limits.standardButtonsCount
						: '∞'}
					)
				</span>
				<Button variant='outlined' onClick={() => addButtonHandler(channel)}>
					Добавить кнопку
				</Button>
				<FormControlLabel
					control={
						<Switch
							checked={channel.isInlineKeyboardButtons}
							onChange={() => {
								inlineButtonTypeSwitchHandler(channel);
							}}
						/>
					}
					label='Использовать Inline-отображение для кнопок'
				/>
			</div>

			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					columnGap: '5px',
					rowGap: '10px',
				}}
				key={index}
			>
				{channel.standardKeyboardButtons.map(
					(button, index) => {
						return (
							<div
								key={index}
								style={{
									display: 'flex',
									alignItems: 'center',
									flexDirection: 'column',
									rowGap: '5px',
									border: '1px solid gray',
									borderRadius: '5px',
									padding: '5px',
									width: '350px',
								}}
							>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										width: '100%',
									}}
								>
									<div
										style={{
											display: 'flex',
										}}
									>
										{' '}
										{`Кнопка №${index + 1}`}
									</div>

									<CloseIcon
										fontSize='small'
										onClick={() => {
											delButtonHandler(channel, index);
										}}
										className='svgClose'
										sx={{
											display: 'flex',
											':hover': {
												color: 'red',
												cursor: 'pointer',
											},
										}}
									/>
								</div>

								<TextField
									variant='outlined'
									label={`Название кнопки ${button.name.length}/20`}
									value={button.name}
									onChange={e => buttonNameHandler(e, channel, index)}
									fullWidth
								/>
								{channel.limits.standardButtonLink !== 0 ? (
									<FormControlLabel
										control={
											<Switch
												checked={button.isLinkButton}
												onChange={() => {
													switchSingleButtonTypeHandler(channel, button, index);
												}}
											/>
										}
										label='Кнопка ссылка'
									/>
								) : (
									<></>
								)}
								<TextField
									variant='outlined'
									label={
										button.isLinkButton
											? `Ссылка`
											: `Текст кнопки ${button.text.length}/${
													channel.limits.standardButtonTextLength !== -1
														? channel.limits.standardButtonTextLength
														: '∞'
											  }`
									}
									value={button.text}
									onChange={e => buttonTextHandler(e, channel, index)}
									fullWidth
									multiline
								/>
							</div>
						);
					},
					[channel]
				)}
			</div>
		</div>
	);
};
export default memo(StandardButtonsList);
