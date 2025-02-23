<?php

namespace App\Services\Interfaces;

use App\Models\User;

interface UserPreferenceServiceInterface
{
    public function updatePreferences(User $user, array $preferences);
    public function getPreferences(User $user);
    public function getPersonalizedFeed(User $user);
}
