import { Howl } from 'howler';

// 成功音效 (Chime/Success)
const successSound = new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/600/600-preview.mp3'],
    volume: 0.4,
});

// 错误音效 (Buzzer/Wrong)
const errorSound = new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2959/2959-preview.mp3'],
    volume: 0.2,
});

// 连击音效 (Combo)
const comboSound = new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'],
    volume: 0.4,
});

export const playSuccess = () => successSound.play();
export const playError = () => errorSound.play();
export const playCombo = () => comboSound.play();
