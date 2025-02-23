<?php

namespace App\Repositories\Interfaces;

use App\Models\User;

interface UserPreferenceRepositoryInterface
{
    public function updatePreferences(User $user, array $preferences);
    public function getPreferences(User $user);
}
