import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Onboarding - Страница первичной регистрации пользователя
 * Собирает: Имя, Пол, Город, Хобби
 * После успешного создания профиля -> редирект на /calendar
 */
const Onboarding = () => {
    const navigate = useNavigate();
    const { createUser, user, tgUser } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        city: '',
        hobby: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Если пользователь уже зарегистрирован, перенаправляем на календарь (после рендера)
    useEffect(() => {
        if (user) navigate('/calendar', { replace: true });
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleGenderSelect = (gender) => {
        setFormData((prev) => ({ ...prev, gender }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Валидация
        if (!formData.name.trim()) {
            setError('Пожалуйста, введите ваше имя');
            return;
        }
        if (!formData.gender) {
            setError('Пожалуйста, выберите пол');
            return;
        }
        if (!formData.city.trim()) {
            setError('Пожалуйста, введите ваш город');
            return;
        }
        if (!formData.hobby.trim()) {
            setError('Пожалуйста, введите ваше хобби');
            return;
        }

        setLoading(true);

        try {
            // Создаем пользователя в БД с реальным telegram_id
            await createUser({
                name: formData.name.trim(),
                gender: formData.gender,
                city: formData.city.trim(),
                hobby: formData.hobby.trim(),
            });

            // Редирект на календарь
            navigate('/calendar', { replace: true });
        } catch (err) {
            console.error('Onboarding error:', err);
            const msg = err?.message || err?.code || 'Произошла ошибка при создании профиля. Попробуйте еще раз.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-center" style={{paddingInline: 24}}>
            <div className="card" style={{paddingInline: 24}}>
                <div className="title">🎄 Добро пожаловать!</div>
                <div className="subtitle">Расскажите немного о себе, чтобы начать новогоднее приключение</div>
                <div className="decor-row" style={{justifyContent:'center', marginBottom:12}}>
                    <span style={{fontSize:28}}>⛄</span>
                    <span style={{fontSize:24}}>🎁</span>
                    <span style={{fontSize:24}}>🎄</span>
                </div>

                {/* Форма */}
                <form onSubmit={handleSubmit}>
                    {/* Имя */}
                    <div className="field">
                        <label className="label">Как тебя зовут?</label>
                        <div className="input-wrap">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Твое имя"
                            className="input"
                            maxLength={50}
                        />
                        </div>
                    </div>

                    {/* Пол */}
                    <div className="field">
                        <label className="label">Ты мальчик или девочка?</label>
                        <div className="chips">
                            <button
                                type="button"
                                onClick={() => handleGenderSelect('boy')}
                                className={`chip ${formData.gender === 'boy' ? 'active' : ''}`}
                            >
                                👦 Мальчик
                            </button>
                            <button
                                type="button"
                                onClick={() => handleGenderSelect('girl')}
                                className={`chip ${formData.gender === 'girl' ? 'active' : ''}`}
                            >
                                👧 Девочка
                            </button>
                        </div>
                    </div>

                    {/* Город */}
                    <div className="field">
                        <label className="label">В каком городе ты живешь?</label>
                        <div className="input-wrap">
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Название города"
                            className="input"
                            maxLength={50}
                        />
                        </div>
                    </div>

                    {/* Хобби */}
                    <div className="field">
                        <label className="label">Какое у тебя любимое хобби?</label>
                        <div className="input-wrap">
                        <input
                            type="text"
                            name="hobby"
                            value={formData.hobby}
                            onChange={handleChange}
                            placeholder="Твое увлечение"
                            className="input"
                            maxLength={50}
                        />
                        </div>
                    </div>

                    {/* Ошибка */}
                    {error && (<div className="info" style={{border:'1px solid rgba(239,68,68,.5)', background:'rgba(239,68,68,.15)'}}>{error}</div>)}

                    {/* Кнопка отправки */}
                    <button type="submit" disabled={loading} className="btn btn-primary" style={{width:'100%'}}>
                        {loading ? (
                            <span style={{display:'flex', alignItems:'center', justifyContent:'center', gap:8}}>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938л3-2.647z" />
                                </svg>
                                Создаем профиль...
                            </span>
                        ) : (
                            '✨ Начать приключение'
                        )}
                    </button>
                </form>

                {/* Debug info (только для разработки) */}
                {import.meta.env.DEV && tgUser && (
                    <div className="info">Telegram ID: {tgUser.id}</div>
                )}
            </div>
        </div>
    );
};

export default Onboarding;
