class User < ActiveRecord::Base
  validates_presence_of :email, :fname, :lname, :password_digest, :session_token
  validates_uniqueness_of :email
  validates :password, length: {minimum: 6}, allow_nil: true

  attr_reader :password
  after_initialize :ensure_session_token
  before_validation :ensure_session_token_uniqueness

  def password=(password)
    @password = password
		self.password_digest = BCrypt::Password.create(password)
	end

	def self.find_by_credentials(email, password)
		user = User.find_by(email: email)
    user && user.is_password?(password) ? user : nil
	end

	def is_password?(password)
		BCrypt::Password.new(self.password_digest).is_password?(password)
	end

	def reset_session_token!
		self.session_token = new_session_token
		ensure_session_token_uniqueness
		self.save!
		self.session_token
	end

	private

	def ensure_session_token
		self.session_token ||= new_session_token
	end

	def new_session_token
		SecureRandom.urlsafe_base64
	end

	def ensure_session_token_uniqueness
		while User.find_by(session_token: self.session_token)
			self.session_token = new_session_token
		end
  end



end
