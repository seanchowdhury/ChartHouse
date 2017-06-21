class Api::SessionsController < ApplicationController

	def create
		@user = User.find_by_credentials(
      params[:user][:email],
      params[:user][:password]
    )

    if @user
			login(@user)
			render "api/users/show"
		else
      errors = { base: ["Invalid email/password combination"] }
      if params['user']['password'].length == 0 && params['user']['email'].length == 0
        errors = { password: ["Password cannot be blank"], email: ["Email cannot be blank"]}
      elsif params['user']['email'].length == 0
        errors = { email: ["Email cannot be blank"]}
      elsif params['user']['password'].length == 0
        errors = { password: ["Email cannot be blank"]}
      end
			render(
        json: errors,
        status: 401
      )
		end
	end

	def destroy
		@user = current_user
		if @user
			logout
			render json: {}
		else
			render(
        json: ["Nobody signed in"],
        status: 404
      )
		end
	end

end
