import { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authProvider';
import { NotifType, showNotification } from '../../components/Notif';
import { useSearchParams } from 'react-router-dom';

export default function StepPreferences() {

	const [_, setSearchParams] = useSearchParams();

	return (
		<></>
	)
}