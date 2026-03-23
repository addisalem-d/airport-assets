from models.user import User
from models.location import Location
from models.asset import Asset
from models.maintenance import MaintenanceLog
from db.database import SessionLocal, engine, Base
from core.security import hash_password

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(User).count() == 0:
        db.add(User(name='Addisalem Admin',    username='admin',   email='Addisalem@airport.com',     hashed_password=hash_password('admin123'),   role='administrator', is_active=True, avatar_initials='JA'))
        db.add(User(name='Manager Test', username='user1',   email='manager@airport.com', hashed_password=hash_password('manager123'), role='manager',       is_active=True, avatar_initials='MT'))
        db.add(User(name='Tester Admin', username='test123', email='tester@airport.com',  hashed_password=hash_password('test123'),    role='administrator', is_active=True, avatar_initials='TA'))
        db.commit()
        print('Seeded users.')

    if db.query(Location).count() == 0:
        for l in [
            dict(name='Terminal A',       code='TERM-A',  type='terminal',        building='Main',    floor='1',      description='Main passenger terminal',     is_active=True),
            dict(name='Terminal B',       code='TERM-B',  type='terminal',        building='Main',    floor='1',      description='International terminal',      is_active=True),
            dict(name='Gate 12',          code='G-12',    type='gate',            building='Main',    floor='2',      description='Domestic departure gate',     is_active=True),
            dict(name='Hangar 3',         code='HGR-3',   type='hangar',          building=None,      floor=None,     description='Aircraft maintenance hangar', is_active=True),
            dict(name='Cargo Bay 1',      code='CRG-1',   type='cargo',           building='Cargo',   floor='Ground', description='Main cargo handling area',    is_active=True),
            dict(name='Fuel Depot North', code='FUEL-N',  type='fuel_depot',      building=None,      floor=None,     description='North fuel storage',          is_active=True),
            dict(name='Maint. Bay A',     code='MNT-A',   type='maintenance_bay', building='Service', floor='Ground', description='Vehicle maintenance bay',     is_active=True),
            dict(name='Control Tower',    code='CTL-TWR', type='control_tower',   building='Tower',   floor='8',      description='Air traffic control',         is_active=True),
        ]:
            db.add(Location(**l))
        db.commit()
        print('Seeded locations.')

    if db.query(Asset).count() == 0:
        for a in [
            dict(name='Baggage Tug #1',     serial_number='BT-001', category='ground_support',       status='active',      location_id=1, purchase_date='2022-01-15', purchase_price=45000,  notes=''),
            dict(name='Conveyor Belt A',     serial_number='CB-001', category='baggage_handling',     status='maintenance', location_id=1, purchase_date='2021-06-10', purchase_price=28000,  notes=''),
            dict(name='Fuel Truck #3',       serial_number='FT-003', category='fueling',              status='active',      location_id=6, purchase_date='2020-03-22', purchase_price=120000, notes=''),
            dict(name='Passenger Bus B2',    serial_number='PB-002', category='passenger_services',   status='active',      location_id=2, purchase_date='2023-07-01', purchase_price=85000,  notes=''),
            dict(name='Security Camera #12', serial_number='SC-012', category='security',             status='inactive',    location_id=3, purchase_date='2019-11-05', purchase_price=3500,   notes=''),
            dict(name='Aircraft Jack Set',   serial_number='AJ-001', category='aircraft_maintenance', status='active',      location_id=4, purchase_date='2021-09-14', purchase_price=62000,  notes=''),
            dict(name='Ground Power Unit',   serial_number='GP-005', category='ground_support',       status='active',      location_id=4, purchase_date='2022-04-18', purchase_price=35000,  notes=''),
            dict(name='Cargo Loader CL-4',   serial_number='CL-004', category='baggage_handling',     status='retired',     location_id=5, purchase_date='2016-02-28', purchase_price=95000,  notes=''),
            dict(name='Maintenance Van #2',  serial_number='MV-002', category='vehicles',             status='active',      location_id=7, purchase_date='2023-01-10', purchase_price=42000,  notes=''),
            dict(name='HVAC Unit T-A',       serial_number='HV-001', category='facilities',           status='maintenance', location_id=1, purchase_date='2020-08-30', purchase_price=18000,  notes=''),
        ]:
            db.add(Asset(**a))
        db.commit()
        print('Seeded assets.')

    if db.query(MaintenanceLog).count() == 0:
        users = {u.username: u.id for u in db.query(User).all()}
        for m in [
            dict(asset_id=2,  assigned_to=users['user1'],   type='preventive', priority='medium',   status='in_progress', title='Annual belt inspection', description='Check belt tension',   scheduled_date='2026-03-20', notes=''),
            dict(asset_id=10, assigned_to=users['user1'],   type='preventive', priority='low',      status='scheduled',   title='HVAC seasonal service',  description='Filter replacement',   scheduled_date='2026-03-25', notes=''),
            dict(asset_id=3,  assigned_to=users['admin'],   type='corrective', priority='high',     status='overdue',     title='Brake system repair',    description='Left rear brake pad',  scheduled_date='2026-03-15', notes=''),
            dict(asset_id=6,  assigned_to=users['user1'],   type='inspection', priority='medium',   status='completed',   title='Safety certification',   description='Annual safety check',  scheduled_date='2026-03-10', notes=''),
            dict(asset_id=1,  assigned_to=users['admin'],   type='emergency',  priority='critical', status='in_progress', title='Engine failure repair',  description='Tug stopped on apron', scheduled_date='2026-03-20', notes=''),
            dict(asset_id=9,  assigned_to=users['user1'],   type='preventive', priority='low',      status='scheduled',   title='Oil and filter change',  description='10,000 km service',    scheduled_date='2026-04-01', notes=''),
            dict(asset_id=7,  assigned_to=users['admin'],   type='inspection', priority='medium',   status='cancelled',   title='Electrical inspection',  description='Wiring check',         scheduled_date='2026-03-18', notes=''),
        ]:
            db.add(MaintenanceLog(**m))
        db.commit()
        print('Seeded maintenance.')

    db.close()
    print('Seed complete.')

if __name__ == '__main__':
    seed()
